import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMetaDto } from './dto/create-meta.dto';
import { UpdateMetaDto } from './dto/update-meta.dto';
import { Meta } from './entities/meta.entity';
import { Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuariosService } from 'src/usuarios/usuarios.service';

@Injectable()
export class MetasService {

  constructor(
     @InjectRepository(Meta) private readonly metasRepository: Repository<Meta>,
     private readonly  usuariosService: UsuariosService,
  ) {}  

  async create(createMetaDto: CreateMetaDto) {
      const usuario = await this.usuariosService.findOne(createMetaDto.usuario_id);
      if (!usuario) {
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }

      const existingMeta = await this.metasRepository.findOne({
        where: {
          usuario: { id: createMetaDto.usuario_id },
          estado: 1, // Estado activo
        },
      });

      if (existingMeta) {
        throw new HttpException('Ya existe una meta activa para este usuario', HttpStatus.BAD_REQUEST);
      }
      
      const currentMonth = new Date().getMonth() + 1; // 1-12
      const mes = parseInt(createMetaDto.mes, 10);
      if (mes > 12) {
        throw new HttpException('El mes no puede ser mayor a 12', HttpStatus.BAD_REQUEST);
      }
      if (mes < currentMonth) {
        throw new HttpException('El mes debe ser igual o superior al mes actual', HttpStatus.BAD_REQUEST);
      }
       
     const newMeta = await this.metasRepository.save({...createMetaDto,usuario});
     if (!newMeta) {
        throw new HttpException('Error al crear la meta', HttpStatus.INTERNAL_SERVER_ERROR);
      }
      
      return newMeta;
   
  }


    async findAll(page: number, limit: number) {
      const [result, total] = await this.metasRepository.findAndCount({
        where: { estado: Not(0) }, // Filtrar por estado diferente de 0
        order: { id: 'DESC' }, // Ordenar por ID de forma ascendente
        skip: (page - 1) * limit, // Saltar registros según la página
        take: limit, // Limitar la cantidad de registros
        relations: ['usuario'], // Incluir la relación con el usuario
      });

      return {
        data: result,
        total,
        page,
        lastPage: Math.ceil(total / limit),
      };
    }
  

  findOne(id: number) {
    const meta = this.metasRepository.findOneBy({ id });
    if (!meta) {
      throw new HttpException('Meta no encontrada', HttpStatus.NOT_FOUND);
    }
     return meta;
  }
  async update(id: number, updateMetaDto: UpdateMetaDto) {
    const meta = await this.metasRepository.findOneBy({ id, estado: Not(0) });
    if (!meta || meta.estado === 0) {
      throw new HttpException('Meta no encontrada', HttpStatus.NOT_FOUND);
    }

   


    const currentMonth = new Date().getMonth() + 1; // 1-12
    if(updateMetaDto.mes){
      const mes = parseInt(updateMetaDto.mes, 10);
    if (mes > 12) {
      throw new HttpException('El mes no puede ser mayor a 12', HttpStatus.BAD_REQUEST);
    }
    if (mes < currentMonth) {
      throw new HttpException('El mes debe ser igual o superior al mes actual', HttpStatus.BAD_REQUEST);
    }
    }
    
    Object.assign(meta, { ...updateMetaDto });
    const updateMeta = await this.metasRepository.save(meta);
    if (!updateMeta) {
      throw new HttpException('Error al actualizar la meta', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return updateMeta;
  }

  remove(id: number) {
    const meta = this.metasRepository.findOneBy({ id, estado: Not(0) });
    if (!meta) {
      throw new HttpException('Meta no encontrada', HttpStatus.NOT_FOUND);
    }
    return meta;
  }
}
