import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { ListUsersQueryDto } from './dto/list-users.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { PaginatedResponseDto } from '../common/dto/pagination.dto';
import { Role } from '../common/enums/role.enum';

/**
 * Single source of truth for the "what can leave the API" projection.
 * `password` is intentionally absent — Prisma never even fetches it.
 */
const publicSelect = {
  id: true,
  login: true,
  email: true,
  role: true,
  createdAt: true,
  deletedAt: true,
} satisfies Prisma.UsersSelect;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    query: ListUsersQueryDto,
  ): Promise<PaginatedResponseDto<UserResponseDto>> {
    const { page, limit, role, includeDeleted } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.UsersWhereInput = {
      ...(role && { role }),
      ...(includeDeleted ? {} : { deletedAt: null }),
    };

    // Single round-trip: data + total in parallel.
    const [data, total] = await this.prisma.$transaction([
      this.prisma.users.findMany({
        where,
        select: publicSelect,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.users.count({ where }),
    ]);

    return {
      data: data as unknown as UserResponseDto[],
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.users.findFirst({
      where: { id, deletedAt: null },
      select: publicSelect,
    });
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user as unknown as UserResponseDto;
  }

  /**
   * Soft-delete strategy:
   *   - Set `deletedAt = new Date()`
   *   - All read paths filter `deletedAt: null`
   *   - Allows audit trail, undelete, FK integrity (notes/orders stay valid)
   *
   * Hard-delete alternative:
   *   - `prisma.users.delete({ where: { id } })`
   *   - Pros: GDPR "right to erasure" compliance out of the box, no orphaned data
   *   - Cons: cascades to notes/orders (must add `onDelete: Cascade` to relations
   *           or pre-delete dependents); irreversible; foreign keys can break
   *           historical reports
   *   - Recommended only when you have a true compliance requirement; even then,
   *     prefer "anonymize-then-soft-delete" (replace PII, set deletedAt) to keep
   *     reporting consistent.
   */
  async softDelete(id: string, currentUserId: string): Promise<void> {
    if (id === currentUserId) {
      // 403 — semantically "you may not perform this action" (vs 400 input err)
      throw new ForbiddenException('Admins cannot delete their own account');
    }

    const user = await this.prisma.users.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User ${id} not found`);
    if (user.deletedAt) {
      throw new ConflictException('User is already deleted');
    }

    // Optional safety: prevent removing the last ADMIN.
    if (user.role === Role.ADMIN) {
      const remainingAdmins = await this.prisma.users.count({
        where: { role: Role.ADMIN as any, deletedAt: null, NOT: { id } },
      });
      if (remainingAdmins === 0) {
        throw new ConflictException('Cannot delete the last remaining ADMIN');
      }
    }

    await this.prisma.users.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
