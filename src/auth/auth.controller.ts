import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';
import { CreateUsuarioDto } from 'src/usuarios/dto/create-usuario.dto';
import { LoginUsuarioDto } from 'src/usuarios/dto/login-usuario.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
//import { ApiTags } from '@nestjs/swagger';


//@ApiTags('auth  ')
@Controller('auth')
export class AuthController {

    constructor(
      private readonly authService:AuthService
    ) {}
   
    @Post('loginUser')
    LoginUser(@Body() loginUsuarioGestorDto:LoginUsuarioDto){
        return this.authService.loginUser(loginUsuarioGestorDto);
    }
    @ApiBearerAuth()
    @Auth('admin') // Solo los administradores pueden acceder a este endpoint
    @Post('registerUser')
    RegisterUser(@Body() createUsuarioDto:CreateUsuarioDto){
        return this.authService.registerUsuarios(createUsuarioDto);
    }    
}
