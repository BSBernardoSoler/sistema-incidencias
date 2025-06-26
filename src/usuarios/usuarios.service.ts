import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/usuario.entity';
import { Like, Repository } from 'typeorm';
import { Role } from 'src/roles/entities/role.entity';
import * as  bcryptjs from 'bcryptjs';


@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async findOneWithRoles(usuario: string) {
    return this.userRepository.findOne({
      where: { correo: usuario },
      relations: ['rol'], // Asegúrate de que la relación con roles esté configurada
    });
  }

  async findOneByCorreoWithPassword (correo:string){
    const user =await this.userRepository.findOne({
      where:{
        correo
      },
      select:{
        id:true,
        nombres:true ,
        password: true,
        rol:true,
        correo:true
      },
      relations:{
        rol:true}
    });
    return user;

  }

  async findOneByCorreo(correo : string){
    const user = await this.userRepository.findOneBy({
      correo
    }
  )
    return user;
  }


  async findOneByDni(dni : string){
    const user = await this.userRepository.findOneBy({
      dni
    }
  )
    return user;
  }


  async findUserByDni(dni: string) {
    const users = await this.userRepository.find({
      where: {
        dni: dni ? Like(`%${dni}%`) : undefined,
      },
    });
    return users || [];
  }

    async findUserByTerminoBusqueda(termino: string) {
      const users = await this.userRepository.find({
        where: [
          { dni: termino ? Like(`%${termino}%`) : undefined },
          { apellidos: termino ? Like(`%${termino}%`) : undefined },
        ],
      });
      return users || [];
    }



  create(createUsuarioDto: CreateUsuarioDto, rol) {
    
    return this.userRepository.save({
      ...createUsuarioDto,
      rol,
    });
  }

  async findAll(page: number = 1, limit: number = 10) {
    const [usuarios, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        nombres: true,
        apellidos: true,
        telefono: true,
        password: false, // No devolver la contraseña
        correo: true,
        dni: true,
        estado: true,
        rol: {
          id: true,
          nombre: true,
          descripcion: true,
        },
      },
      relations: ['rol'],
      order: {
        id: 'DESC',
      },
    });
    return {
      data: usuarios,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  findOne(id: number) {   
     return this.userRepository.findOneBy({ id }); 
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    // Buscar el usuario existente
    const usuario = await this.userRepository.findOne({
      where: { id },
      relations: ['rol'],
    });
    if (!usuario) {
      throw new Error(`Usuario con id ${id} no encontrado`);
    }

    // Validar correo si se está actualizando
    if (updateUsuarioDto.correo && updateUsuarioDto.correo !== usuario.correo) {
      const existeCorreo = await this.userRepository.findOneBy({ correo: updateUsuarioDto.correo });
      if (existeCorreo) {
        throw new Error('El correo ya está en uso por otro usuario');
      }
    }

    // Validar DNI si se está actualizando
    if (updateUsuarioDto.dni && updateUsuarioDto.dni !== usuario.dni) {
      const existeDni = await this.userRepository.findOneBy({ dni: updateUsuarioDto.dni });
      if (existeDni) {
        throw new Error('El DNI ya está en uso por otro usuario');
      }
    }

    // Si se envía un rolId en el DTO, buscar el objeto rol y asignarlo
    if (updateUsuarioDto.rol_id) {
      const rolRepository = this.userRepository.manager.getRepository(Role);
      const rol = await rolRepository.findOneBy({ id: updateUsuarioDto.rol_id });
      if (!rol) {
        throw new Error('El rol especificado no existe');
      }
      usuario.rol = rol;
    }

    // Encriptar la contraseña si se está actualizando
    if (updateUsuarioDto.password) {
      usuario.password = await bcryptjs.hash(updateUsuarioDto.password, 10);
    }
     
    // Si no se envía una contraseña, mantener la contraseña actual
    else {
      updateUsuarioDto.password = usuario.password;
    }

    // Actualizar los campos permitidos (excepto rol y password, que ya se asignaron si corresponde)
    Object.assign(usuario, { ...updateUsuarioDto, rol: usuario.rol ,password: usuario.password });
    // Evitar sobreescribir password si no se actualizó
   
    // Guardar los cambios
    return await this.userRepository.save(usuario);
  }

  async remove(id: number) {
    const usuario = await this.userRepository.findOneBy({ id });
    if (!usuario) {
      throw new HttpException(`Usuario con id ${id} no encontrado`, HttpStatus.NOT_FOUND);
    }
    if (usuario.estado === 0) {
      throw new HttpException('El usuario ya está eliminado', HttpStatus.BAD_REQUEST);
    }
    usuario.estado = 0;
    return await this.userRepository.save(usuario);
  }
}
