import { IsString, IsOptional, MinLength, IsBoolean } from 'class-validator';

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    userName?: string;

    @IsString()
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    @IsOptional()
    password?: string;

    @IsBoolean()
    @IsOptional()
    active?: boolean;

    @IsOptional()
  roleId?: number; 
}
