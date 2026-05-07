import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AiService } from './ai.service';
import { RecommendationRequestDto } from './dto/recommendation-request.dto';
import { RecommendationResponseDto } from './dto/recommendation-response.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('ai')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.MANAGER, Role.READER)
@Controller('ai')
export class AiController {
  constructor(private readonly ai: AiService) {}

  /**
   * Tighter throttle than the global default — LLM calls are expensive.
   * 10 req / 60s per IP+user.
   *
   * `@nestjs/throttler` v4 API: `@Throttle(limit, ttl)` where `ttl` is in seconds.
   * (v5 uses the named-tracker object form `@Throttle({ default: { limit, ttl } })`.)
   */
  @Throttle(10, 60)
  @Post('recommendations')
  @ApiOperation({ summary: 'Get AI-generated book recommendations' })
  @ApiOkResponse({ type: RecommendationResponseDto })
  recommend(
    @Body() dto: RecommendationRequestDto,
  ): Promise<RecommendationResponseDto> {
    return this.ai.recommend(dto);
  }
}
