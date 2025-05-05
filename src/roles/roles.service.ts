import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository, Not } from 'typeorm';

@Injectable()
export class RolesService {

  constructor(
      @InjectRepository(Role)
      private readonly userRepository: Repository<Role>,
    ) {} 



  async findOneRol(rol: number) {
    return this.userRepository.findOne({
      where: { id: rol },
    });
  }
    
  async create(createRoleDto: CreateRoleDto) {
 
      // validacion de que no exista un rol con el mismo nombre
      const existingRole = await this.userRepository.findOne({
        where: { nombre: createRoleDto.nombre },
      });
      if (existingRole) {
        throw new HttpException("ya hay un rol con este nombre",HttpStatus.CONFLICT);
      }
      const newRole = this.userRepository.create(createRoleDto);
      return await this.userRepository.save(newRole);
   
  }

  async findAll() {
    
      const roles = await this.userRepository.find(
        {
          where: { estado: Not(0) }, // Filtrar por estado diferente de 0
          order: { id: 'ASC' }, // Ordenar por ID de forma ascendente
        }
      );
      if (!roles || roles.length === 0) {
      throw new HttpException('Roles no encontrados', HttpStatus.NOT_FOUND);
      }
      return roles;
  
  }

  async findOne(id: number) {
    
      const role = await this.userRepository.findOneBy({ id });
      if (!role) { 
        throw new HttpException('Rol no encontrado', HttpStatus.NOT_FOUND);
      }
      return role;
  
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
   
      // Validar si el rol existe
      const existingRole = await this.userRepository.findOneBy({ id });
      if (!existingRole) {
        throw new HttpException('Rol no encontrado', HttpStatus.NOT_FOUND);
      }

      // Actualizar el rol
      Object.assign(existingRole, updateRoleDto);
      return await this.userRepository.save(existingRole);

   
  }

  async remove(id: number) {
    
      const role = await this.userRepository.findOneBy({ id });
      if (!role) {
        throw new HttpException('Rol no encontrado', HttpStatus.NOT_FOUND);
      }
      const result =await this.userRepository.delete(id);
      if (result.affected === 0) {
        throw new HttpException('No se pudo eliminar el rol', HttpStatus.INTERNAL_SERVER_ERROR);
      }
      return result
  }
}
