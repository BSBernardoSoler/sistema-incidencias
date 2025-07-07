import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateHistorialCambioDto } from './dto/create-historial-cambio.dto';
import { UpdateHistorialCambioDto } from './dto/update-historial-cambio.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Not, Repository } from 'typeorm';
import { HistorialCambio } from './entities/historial-cambio.entity';
import { Registro } from '../registros/entities/registro.entity';
import { User } from '../usuarios/entities/usuario.entity';
import { AlertasWebsocketsGateway } from 'src/alertas-websockets/alertas-websockets.gateway';

@Injectable()
export class HistorialCambiosService {
  constructor(
    @InjectRepository(HistorialCambio)
    private readonly historialCambioRepository: Repository<HistorialCambio>,
    @InjectRepository(Registro)
    private readonly registroRepository: Repository<Registro>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly alertasWebsocketsGateWay: AlertasWebsocketsGateway,
  ) {}

  async create(createHistorialCambioDto: CreateHistorialCambioDto) {
    const registro = await this.registroRepository.findOne({
      where: { id: createHistorialCambioDto.registro_id , estado: Not(0) },
    });
    if (!registro) {
      throw new Error('Registro no encontrado');
    }

    const usuario = await this.userRepository.findOne({
      where: { id: createHistorialCambioDto.usuario_modifica_id, estado: Not(0) },
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
    const newHistorialCambio = await this.historialCambioRepository.save(historialCambio);
    if (!newHistorialCambio) {
      throw new Error('Error al crear el historial de cambios');
    }
    this.alertasWebsocketsGateWay.notifyClient(registro, `se ha hecho un cambio en el registro ${registro.id}`, 'historial-cambios');
    return newHistorialCambio;
  }
  async findAll(page: number , limit: number ) {
    const [result, total] = await this.historialCambioRepository.findAndCount({
      where: { estado: Not(0) }, // Filtrar solo los registros activos
      relations: ['registro', 'usuarioModifica'],
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'DESC' },
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
      where: { id, estado: Not(0) },
      relations: ['registro', 'usuarioModifica'],
    });
    if (!historialCambio) {
      throw new Error('HistorialCambio no encontrado');
    }
    return historialCambio;
  }

  async update(id: number, updateHistorialCambioDto: UpdateHistorialCambioDto) {
    const historialCambio = await this.historialCambioRepository.findOne({ where: { id, estado: Not(0) } });
    if (!historialCambio) {
      throw new Error('HistorialCambio no encontrado');
    }

    if (updateHistorialCambioDto.registro_id) {
      const registro = await this.registroRepository.findOne({
        where: { id: updateHistorialCambioDto.registro_id , estado: Not(0) },
      });
      if (!registro) {
        throw new Error('Registro no encontrado');
      }
      historialCambio.registro = registro;
    }

    if (updateHistorialCambioDto.usuario_modifica_id) {
      const usuario = await this.userRepository.findOne({
        where: { id: updateHistorialCambioDto.usuario_modifica_id , estado: Not(0) },
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
    const historialCambio = await this.historialCambioRepository.findOne({ where: { id, estado: Not(0) } });
    if (!historialCambio) {
      throw new Error('HistorialCambio no encontrado');
    }
    historialCambio.estado = 0;
    await this.historialCambioRepository.save(historialCambio);
    return { message: 'HistorialCambio desactivado correctamente' };
  }


  async countToday() {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    const count = await this.historialCambioRepository.count({
      where: {
        id: Not(0),
        fecha_modificacion: Between(startOfDay, endOfDay), // Asegurarse de que la modificación esté activa
      },
    });
  
    return {
      count,
      message: `Total de cambios realizados hoy: ${count}`,
      status: HttpStatus.OK,
    };
  }

  async findAllChangeHistory(): Promise<any[]> {
  return this.historialCambioRepository.find({
    relations: ['usuarioModifica'],
    order: {
      fecha_modificacion: 'DESC',
    },
  });
}

}
