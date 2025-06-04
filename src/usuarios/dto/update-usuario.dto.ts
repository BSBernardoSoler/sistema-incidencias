import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional, IsEmail, IsNotEmpty, IsInt, Matches } from 'class-validator';

export class UpdateUsuarioDto {
    @IsOptional()
    @IsString()
    nombres?: string;

    @IsOptional()
    @IsString()
    apellidos?: string;
    
    @IsOptional()
    @IsString()
    @Matches(/^\d{8}$/, { message: 'El DNI debe tener exactamente 8 dígitos' })
    dni?: string;

    @IsOptional()
    @IsEmail()
    correo?: string;

    @IsOptional()
    @IsString()
    @Matches(/^\d{9}$/, { message: 'El teléfono debe tener exactamente 9 dígitos' })
    telefono?: string;

    @IsOptional()
    @IsString()
    @Matches(/^.{8,}$/, { message: 'La contraseña debe tener al menos 8 caracteres' })
    password?: string;

    @IsOptional()
    @IsInt()
    estado?: number;

    @IsOptional()
    @IsInt()
    rol_id?: number;
}
