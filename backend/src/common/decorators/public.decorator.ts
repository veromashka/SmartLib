import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Marks a route as publicly accessible — bypasses JwtAuthGuard
 * even if the guard is registered globally.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
