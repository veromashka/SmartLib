import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../common/enums/role.enum';

export class AuthUserDto {
  @ApiProperty() id: string;
  @ApiProperty() login: string;
  @ApiProperty() email: string;
  @ApiProperty({ enum: Role }) role: Role;
}

export class AuthResponseDto {
  @ApiProperty() accessToken: string;
  @ApiProperty({ type: AuthUserDto }) user: AuthUserDto;
}
