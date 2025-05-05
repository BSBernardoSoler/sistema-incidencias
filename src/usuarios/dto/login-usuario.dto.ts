import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginUsuarioDto {
    @IsEmail({}, { message: 'El correo electrónico no es válido' })
    email: string;
    
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
    password: string;
}