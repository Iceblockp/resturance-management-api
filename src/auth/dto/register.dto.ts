import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '../../common/enums/user-role.enum';

export class RegisterDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'My Restaurant' })
  @IsString()
  @IsOptional()
  restaurantName?: string;

  @ApiProperty({ enum: UserRole, example: UserRole.SERVER, required: false })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}