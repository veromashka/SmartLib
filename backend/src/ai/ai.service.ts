import {
  BadGatewayException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import type { Cache } from 'cache-manager';
import OpenAI, { APIError } from 'openai';
import { RecommendationRequestDto } from './dto/recommendation-request.dto';
import { RecommendationResponseDto } from './dto/recommendation-response.dto';

const MAX_RETRIES = 2;
const BASE_BACKOFF_MS = 800;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h — recommendations are stable enough

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly client: OpenAI;
  private readonly model: string;

  constructor(
    config: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {
    const apiKey = config.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }
    this.client = new OpenAI({ apiKey });
    this.model = config.get<string>('OPENAI_MODEL', 'gpt-4o-mini');
  }

  async recommend(
    dto: RecommendationRequestDto,
  ): Promise<RecommendationResponseDto> {
    const cacheKey = this.makeCacheKey(dto);

    const cached = await this.cache.get<RecommendationResponseDto>(cacheKey);
    if (cached) {
      this.logger.debug(`AI cache HIT ${cacheKey}`);
      return cached;
    }

    const { system, user } = this.buildPrompt(dto);
    const raw = await this.callOpenAiWithRetry(system, user);
    const parsed = this.parseResponse(raw, dto.genre);

    await this.cache.set(cacheKey, parsed, CACHE_TTL_MS);
    return parsed;
  }

  /**
   * Wraps the chat-completions call with retry on transient failures only.
   * Quota / auth errors are NOT retried — they need human intervention.
   */
  private async callOpenAiWithRetry(
    system: string,
    user: string,
  ): Promise<string> {
    let attempt = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        const completion = await this.client.chat.completions.create({
          model: this.model,
          temperature: 0.7,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: user },
          ],
        });
        return completion.choices[0]?.message?.content ?? '';
      } catch (err) {
        const mapped = this.mapOpenAiError(err);

        // Retry only transient: rate-limit (not quota) or 5xx.
        if (mapped.retryable && attempt < MAX_RETRIES) {
          const delay = BASE_BACKOFF_MS * 2 ** attempt;
          this.logger.warn(
            `OpenAI transient error (attempt ${attempt + 1}/${MAX_RETRIES + 1}), retrying in ${delay}ms: ${mapped.exception.message}`,
          );
          await new Promise((r) => setTimeout(r, delay));
          attempt += 1;
          continue;
        }

        throw mapped.exception;
      }
    }
  }

  /**
   * Maps OpenAI's APIError → NestJS exception with the right HTTP status,
   * and a `retryable` flag for the caller.
   */
  private mapOpenAiError(err: unknown): {
    exception: HttpException;
    retryable: boolean;
  } {
    if (err instanceof APIError) {
      const code = (err as APIError).code as string | undefined;
      const status = err.status;

      // Billing exhausted / no payment method — not retryable, surface clearly.
      if (status === 429 && code === 'insufficient_quota') {
        this.logger.error(
          'OpenAI quota exhausted (billing). Add a payment method or top up at https://platform.openai.com/account/billing',
        );
        return {
          // 402 Payment Required — accurate semantically; not all NestJS
          // versions ship a dedicated exception class, so build it manually.
          exception: new HttpException(
            'AI provider quota exhausted. Please contact the administrator.',
            HttpStatus.PAYMENT_REQUIRED,
          ),
          retryable: false,
        };
      }

      // Real rate limit (per-minute) — retry helps.
      if (status === 429) {
        return {
          exception: new ServiceUnavailableException(
            'AI provider rate limit reached, please retry shortly',
          ),
          retryable: true,
        };
      }

      if (status === 401) {
        this.logger.error('OpenAI rejected the API key (401)');
        return {
          exception: new UnauthorizedException('AI provider auth failed'),
          retryable: false,
        };
      }

      if (status && status >= 500) {
        return {
          exception: new ServiceUnavailableException(
            'AI provider is having issues',
          ),
          retryable: true,
        };
      }
    }

    this.logger.error(`OpenAI call failed: ${(err as Error)?.message ?? err}`);
    return {
      exception: new ServiceUnavailableException(
        'AI service is temporarily unavailable',
      ),
      retryable: false,
    };
  }

  private makeCacheKey(dto: RecommendationRequestDto): string {
    const authors = (dto.favoriteAuthors ?? [])
      .map((a) => a.toLowerCase().trim())
      .sort()
      .join('|');
    return `ai:rec:${dto.genre.toLowerCase().trim()}:${dto.limit ?? 5}:${authors}`;
  }

  /**
   * Prompt engineering — separated so it's easy to A/B test prompts later.
   * Strict schema instruction → far fewer parse failures.
   */
  private buildPrompt(dto: RecommendationRequestDto): {
    system: string;
    user: string;
  } {
    const limit = dto.limit ?? 5;

    const system = [
      'You are a literary recommendation engine for a book library service.',
      'You ONLY return strict JSON matching the requested schema, with no prose, no markdown.',
      'Schema:',
      '{',
      '  "similarGenres": string[],   // 3-6 sub/adjacent genres',
      `  "books": [{ "title": string, "author": string, "reason": string }],   // exactly ${limit} entries`,
      '  "explanation": string        // 1-3 sentences, plain text',
      '}',
      'Rules: real, well-known books only. No invented titles. No NSFW.',
    ].join('\n');

    const userParts = [`Primary genre: ${dto.genre}`];
    if (dto.favoriteAuthors?.length) {
      userParts.push(
        `User already likes these authors: ${dto.favoriteAuthors.join(', ')}.`,
      );
    }
    userParts.push(`Return exactly ${limit} book recommendations.`);

    return { system, user: userParts.join('\n') };
  }

  private parseResponse(
    raw: string,
    genre: string,
  ): RecommendationResponseDto {
    try {
      const parsed = JSON.parse(raw);
      return {
        genre,
        similarGenres: Array.isArray(parsed.similarGenres)
          ? parsed.similarGenres.map(String)
          : [],
        books: Array.isArray(parsed.books)
          ? parsed.books.map((b: any) => ({
              title: String(b?.title ?? ''),
              author: String(b?.author ?? ''),
              reason: String(b?.reason ?? ''),
            }))
          : [],
        explanation: String(parsed.explanation ?? ''),
      };
    } catch (err) {
      this.logger.error(
        `Failed to parse OpenAI response: ${(err as Error).message}; raw=${raw.slice(0, 200)}`,
      );
      throw new BadGatewayException('AI returned malformed response');
    }
  }
}
