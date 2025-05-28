import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import * as  bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { CreateUsuarioDto } from 'src/usuarios/dto/create-usuario.dto';
import { LoginUsuarioDto } from 'src/usuarios/dto/login-usuario.dto';
import { RolesService } from 'src/roles/roles.service';
import { User } from 'src/usuarios/entities/usuario.entity';


@Injectable()
export class AuthService {


    constructor(
        private readonly usuarioService:UsuariosService,
        private readonly  jwtService : JwtService,
        private readonly rolService: RolesService
    ) {}

// funcion para registrar usuarios
 async registerUsuarios(createUsuarioDto: CreateUsuarioDto){
    const user  = await this.usuarioService.findOneByCorreo(createUsuarioDto.correo);
    const dni  = await this.usuarioService.findOneByDni(createUsuarioDto.dni);
    const role  = await this.rolService.findOneRol(createUsuarioDto.rol_id);

    
    if(!role){
      throw new HttpException("Este rol no exite",HttpStatus.CONFLICT);
   }
    if(user){
       throw new HttpException("este correo ya ha sido registrado en la app",HttpStatus.CONFLICT);
    }

    if( dni){
      throw new HttpException("este dni ya ha sido registrado en un usuario",HttpStatus.CONFLICT);
   }

   const newuser= await this.usuarioService.create({
    password : await bcryptjs.hash(createUsuarioDto.password,10),
    nombres : createUsuarioDto.nombres,
    apellidos : createUsuarioDto.apellidos,
    dni : createUsuarioDto.dni,
    rol_id : createUsuarioDto.rol_id,
    correo : createUsuarioDto.correo,
    telefono : createUsuarioDto.telefono,
   },role);

   if(!newuser){
    throw new HttpException("hubo un error al registrar el usuario",HttpStatus.BAD_REQUEST);
   }
   
   return {
    id: newuser.id,
    nombres: newuser.nombres,
    apellidos: newuser.apellidos,
    dni: newuser.dni,
    correo: newuser.correo,
    rol_id: newuser.rol_id,
    estado: newuser.estado,
   }

 }


 async loginUser({email,password}:LoginUsuarioDto){
  const user= await this.usuarioService.findOneByCorreoWithPassword(email);

  if(!user){
      throw new UnauthorizedException('este usuario no existe ');
  } 
const isPasswordValid = await bcryptjs.compare(password,user.password);
if(!isPasswordValid){
  throw new UnauthorizedException('contraseña incorrecta');
}
const payload ={usuario : user.correo , role: [{nombre:user.rol.nombre}]};
const role= user.rol.nombre;
const token = await this.jwtService.signAsync(payload);
const nombre = user.nombres;
const id= user.id;
return {
  token,
  user: {
    id,
    nombre,
    email,
    role
  }
};
}

}
 











