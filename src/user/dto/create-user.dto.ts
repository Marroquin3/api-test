import { IsString, MinLength, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
  @IsString()
  userName: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsNumber()
  roleId: number; // Asegúrate que este campo exista si estás asignando roles
}
