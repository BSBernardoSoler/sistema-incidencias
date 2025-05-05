// usuarios/dto/create-usuario.dto.ts
import { IsEmail, IsNotEmpty, IsString, IsDateString, IsInt, IsNumber, IsOptional } from 'class-validator';

export class CreateUsuarioDto {
  @IsNotEmpty()
  @IsString()
  nombres: string;

  @IsNotEmpty()
  @IsString()
  apellidos: string;

  @IsNotEmpty()
  @IsString()
  dni: string;

  @IsNotEmpty()
  @IsEmail()
  correo: string;


  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsInt()
  estado?: number;

  @IsNotEmpty()
  @IsDateString()
  fecha_ingreso: string;

  @IsInt()
  rol_id: number;
}
