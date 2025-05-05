import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import { Role } from 'src/roles/entities/role.entity';

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

  create(createUsuarioDto: CreateUsuarioDto, rol) {
    
    return this.userRepository.save({
      ...createUsuarioDto,
      rol,
    });
  }

  findAll() {
    return `This action returns all usuarios`;
  }

  findOne(id: number) {   
     return this.userRepository.findOneBy({ id }); 
  }

  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return `This action updates a #${id} usuario`;
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }
}
