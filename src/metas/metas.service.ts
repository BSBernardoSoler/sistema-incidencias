import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMetaDto } from './dto/create-meta.dto';
import { UpdateMetaDto } from './dto/update-meta.dto';
import { Meta } from './entities/meta.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuariosService } from 'src/usuarios/usuarios.service';

@Injectable()
export class MetasService {

  constructor(
     @InjectRepository(Meta) private readonly metasRepository: Repository<Meta>,
     private readonly  usuariosService: UsuariosService,
  ) {}  

  async create(createMetaDto: CreateMetaDto) {
    try {
      const user = this.usuariosService.findOne(createMetaDto.usuario_id);
      if (!user) {
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }
      
      const currentMonth = new Date().getMonth() + 1; // Months are 0-indexed
      const currentYear = new Date().getFullYear();

  
      const newMeta = this.metasRepository.create(createMetaDto);
      return await this.metasRepository.save(newMeta);
    } catch (error) {
      return `Error creating meta: ${error.message}`;
    }
  }

  findAll() {
    return `This action returns all metas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} meta`;
  }

  update(id: number, updateMetaDto: UpdateMetaDto) {
    return `This action updates a #${id} meta`;
  }

  remove(id: number) {
    return `This action removes a #${id} meta`;
  }
}
