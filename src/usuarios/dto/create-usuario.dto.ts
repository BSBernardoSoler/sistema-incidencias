// usuarios/dto/create-usuario.dto.ts
import { IsEmail, IsNotEmpty, IsString, IsDateString, IsInt, IsNumber, IsOptional, Matches } from 'class-validator';

export class CreateUsuarioDto {
  @IsNotEmpty()
  @IsString()
  nombres: string;

  @IsNotEmpty()
  @IsString()
  apellidos: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{8}$/, { message: 'El DNI debe tener exactamente 8 dígitos' })
  dni?: string;


  @IsNotEmpty()
  @IsEmail()
  correo: string;


  @IsOptional()
  @IsString()
  @Matches(/^\d{9}$/, { message: 'El teléfono debe tener exactamente 9 dígitos' })
  telefono?: string;

   
  @IsNotEmpty()
  @IsString()
  @Matches(/^.{8,}$/, { message: 'La contraseña debe tener como mínimo 8 caracteres' })
  password: string;

  @IsOptional()
  @IsInt()
  estado?: number;

  @IsInt()
  rol_id: number;
}
