import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMetaDto } from './dto/create-meta.dto';
import { UpdateMetaDto } from './dto/update-meta.dto';
import { Meta } from './entities/meta.entity';
import { Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import e from 'express';

@Injectable()
export class MetasService {

  constructor(
     @InjectRepository(Meta) private readonly metasRepository: Repository<Meta>,
     private readonly  usuariosService: UsuariosService,
  ) {}  

  async create(createMetaDto: CreateMetaDto) {
     const anioActual = new Date().getFullYear();
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

      const añóMeta = existingMeta?.fecha_registro ? new Date(existingMeta.fecha_registro).getFullYear() : null;
      
      const mesMeta = existingMeta?.mes ? parseInt(existingMeta.mes, 10) : null;
      
      if (mesMeta === parseInt(createMetaDto.mes, 10) && existingMeta) {
        throw new HttpException('Ya existe una meta de este mes para este usuario', HttpStatus.BAD_REQUEST);
      }else if (existingMeta && añóMeta !== anioActual) {
        throw new HttpException('Ya existe una meta para este usuario en un año diferente', HttpStatus.BAD_REQUEST);
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
      console.error('Error al actualizar la meta:', updateMeta);
      throw new HttpException('Error al actualizar la meta', HttpStatus.BAD_REQUEST);
    }
    return updateMeta;
  }

  async remove(id: number) {
    const meta = await this.metasRepository.findOneBy({ id, estado: Not(0) });
    if (!meta) {
      throw new HttpException('Meta no encontrada', HttpStatus.NOT_FOUND);
    }
    meta.estado = 0; // Cambiar el estado a 0 para eliminar lógicamente
    const result = await this.metasRepository.save(meta);
    if (!result) {
      throw new HttpException('Error al eliminar la meta', HttpStatus.BAD_REQUEST);
    }
    return meta;
  }

  // Suma total de meta_mensual de todas las metas (sin filtrar por mes actual)
  async sumMetaMensual() {
    const { suma } = await this.metasRepository
      .createQueryBuilder('meta')
      .select('SUM(meta.meta_mensual)', 'suma')
      .where('meta.estado != 0')
      .getRawOne();

    return { suma: parseInt(suma ?? '0', 10) };
  }

  // Resumen de la suma de meta_mensual por cada mes del año actual
  async resumenMetaMensualPorMes() {
    const anioActual = new Date().getFullYear();

    const metas = await this.metasRepository
      .createQueryBuilder('meta')
      .select('meta.mes', 'mes')
      .addSelect('SUM(meta.meta_mensual)', 'suma')
      .where('meta.estado != 0')
      .andWhere('YEAR(meta.fecha_registro) = :anioActual', { anioActual })
      .groupBy('meta.mes')
      .orderBy('meta.mes', 'ASC')
      .getRawMany();

    return metas.map(m => ({
      mes: m.mes,
      suma: parseInt(m.suma, 10),
    }));
  }






  async findAllGoals(): Promise<any[]> {
  return this.metasRepository.find({
    relations: ['usuario'],
    order: {
      fecha_registro: 'DESC',
    },
  });
}

}
