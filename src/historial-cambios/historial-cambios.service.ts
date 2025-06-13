import { Injectable } from '@nestjs/common';
import { CreateHistorialCambioDto } from './dto/create-historial-cambio.dto';
import { UpdateHistorialCambioDto } from './dto/update-historial-cambio.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistorialCambio } from './entities/historial-cambio.entity';
import { Registro } from '../registros/entities/registro.entity';
import { User } from '../usuarios/entities/usuario.entity';

@Injectable()
export class HistorialCambiosService {
  constructor(
    @InjectRepository(HistorialCambio)
    private readonly historialCambioRepository: Repository<HistorialCambio>,
    @InjectRepository(Registro)
    private readonly registroRepository: Repository<Registro>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createHistorialCambioDto: CreateHistorialCambioDto) {
    const registro = await this.registroRepository.findOne({
      where: { id: createHistorialCambioDto.registro_id },
    });
    if (!registro) {
      throw new Error('Registro no encontrado');
    }

    const usuario = await this.userRepository.findOne({
      where: { id: createHistorialCambioDto.registro_id },
    });
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    const historialCambio = this.historialCambioRepository.create({
      registro,
      usuarioModifica: usuario,
      campo_modificado: createHistorialCambioDto.campo_modificado,
      valor_anterior: createHistorialCambioDto.valor_anterior,
      valor_nuevo: createHistorialCambioDto.valor_nuevo,
      fecha_modificacion: createHistorialCambioDto.fecha_modificacion,
      estado: createHistorialCambioDto.estado ?? 1,
    });

    return await this.historialCambioRepository.save(historialCambio);
  }
  async findAll(page: number , limit: number ) {
    const [result, total] = await this.historialCambioRepository.findAndCount({
      relations: ['registro', 'usuarioModifica'],
      skip: (page - 1) * limit,
      take: limit,
      order: { fecha_modificacion: 'DESC' },
    });

    return {
      data: result,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const historialCambio = await this.historialCambioRepository.findOne({
      where: { id },
      relations: ['registro', 'usuarioModifica'],
    });
    if (!historialCambio) {
      throw new Error('HistorialCambio no encontrado');
    }
    return historialCambio;
  }

  async update(id: number, updateHistorialCambioDto: UpdateHistorialCambioDto) {
    const historialCambio = await this.historialCambioRepository.findOne({ where: { id } });
    if (!historialCambio) {
      throw new Error('HistorialCambio no encontrado');
    }

    if (updateHistorialCambioDto.registro_id) {
      const registro = await this.registroRepository.findOne({
        where: { id: updateHistorialCambioDto.registro_id },
      });
      if (!registro) {
        throw new Error('Registro no encontrado');
      }
      historialCambio.registro = registro;
    }

    if (updateHistorialCambioDto.usuario_modifica_id) {
      const usuario = await this.userRepository.findOne({
        where: { id: updateHistorialCambioDto.usuario_modifica_id },
      });
      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }
      historialCambio.usuarioModifica = usuario;
    }

    historialCambio.campo_modificado = updateHistorialCambioDto.campo_modificado ?? historialCambio.campo_modificado;
    historialCambio.valor_anterior = updateHistorialCambioDto.valor_anterior ?? historialCambio.valor_anterior;
    historialCambio.valor_nuevo = updateHistorialCambioDto.valor_nuevo ?? historialCambio.valor_nuevo;
    if (updateHistorialCambioDto.fecha_modificacion !== undefined && updateHistorialCambioDto.fecha_modificacion !== null) {
      historialCambio.fecha_modificacion = typeof updateHistorialCambioDto.fecha_modificacion === 'string'
        ? new Date(updateHistorialCambioDto.fecha_modificacion)
        : updateHistorialCambioDto.fecha_modificacion;
    }
    historialCambio.estado = updateHistorialCambioDto.estado ?? historialCambio.estado;

    return await this.historialCambioRepository.save(historialCambio);
  }

  async remove(id: number) {
    const historialCambio = await this.historialCambioRepository.findOne({ where: { id } });
    if (!historialCambio) {
      throw new Error('HistorialCambio no encontrado');
    }
    await this.historialCambioRepository.remove(historialCambio);
    return { message: 'HistorialCambio eliminado correctamente' };
  }
}
