import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateObservacionDto } from './dto/create-observacione.dto';
import { UpdateObservacioneDto } from './dto/update-observacione.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Observacion } from './entities/observacione.entity';
import { Between, Not, Repository } from 'typeorm';
import { Registro } from 'src/registros/entities/registro.entity';
import { User } from 'src/usuarios/entities/usuario.entity';
import { AlertasWebsocketsGateway } from 'src/alertas-websockets/alertas-websockets.gateway';

@Injectable()
export class ObservacionesService {
  constructor(
    @InjectRepository(Observacion)
    private readonly observacionRepository: Repository<Observacion>,
    @InjectRepository(Registro)
    private readonly registroRepository: Repository<Registro>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly alertasWebsocketsGateway: AlertasWebsocketsGateway, // Inject the AlertasWebsocketsService
  ) {}

  async create(createObservacioneDto: CreateObservacionDto): Promise<Observacion> {
    // Validar existencia de registro y usuario
    const registro = await this.registroRepository.findOne({ where: { id: createObservacioneDto.registro_id , estado: Not(0) } });
    if (!registro) {
      throw new HttpException('Registro no encontrado', HttpStatus.NOT_FOUND);
    }
    const usuario = await this.userRepository.findOne({ where: { id: createObservacioneDto.usuario_reporta_id , estado: Not(0) } });
    if (!usuario) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }
    const observacion = this.observacionRepository.create({
      detalle_observacion: createObservacioneDto.detalle_observacion,
      estado: createObservacioneDto.estado ?? 1,
      respuesta_digitador: createObservacioneDto.respuesta_digitador,
      fecha_observacion: createObservacioneDto.fecha_observacion,
      fecha_respuesta: createObservacioneDto.fecha_respuesta,
      registro,
      usuarioReporta: usuario,
    });
    const newObservacion = await this.observacionRepository.save(observacion);
    if (!newObservacion) {
      throw new HttpException('Error al crear la observación', HttpStatus.BAD_REQUEST);
    }
    this.alertasWebsocketsGateway.notifyClient(registro, `Nueva observación creada en el registro ${registro.id}`, 'observacion-creada');
    return newObservacion;
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ data: Observacion[]; total: number; page: number; limit: number }> {
    const [data, total] = await this.observacionRepository.findAndCount({
      where: { estado: Not(0) }, // Filtrar observaciones activas
      relations: ['registro', 'usuarioReporta'],
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'DESC' },
    });
    return { data, total, page, limit };
  }

  async findOne(id: number): Promise<Observacion> {
    const observacion = await this.observacionRepository.findOne({
      where: { id , estado: Not(0) },
      relations: ['registro', 'usuarioReporta'],
    });
    if (!observacion) {
      throw new NotFoundException(`Observación con id ${id} no encontrada`);
    }
    return observacion;
  }

  async update(id: number, updateObservacioneDto: UpdateObservacioneDto): Promise<Observacion> {
    const observacion = await this.observacionRepository.findOne({ where: { id , estado: Not(0) } });
    if (!observacion) {
      throw new NotFoundException(`Observación con id ${id} no encontrada`);
    }
    if (updateObservacioneDto.registro_id) {
      const registro = await this.registroRepository.findOne({ where: { id: updateObservacioneDto.registro_id } });
      if (!registro) {
        throw new NotFoundException('Registro no encontrado');
      }
      observacion.registro = registro;
    }
    if (updateObservacioneDto.usuario_reporta_id) {
      const usuario = await this.userRepository.findOne({ where: { id: updateObservacioneDto.registro_id } });
      if (!usuario) {
        throw new NotFoundException('Usuario no encontrado');
      }
      observacion.usuarioReporta = usuario;
    }
    Object.assign(observacion, {
      detalle_observacion: updateObservacioneDto.detalle_observacion ?? observacion.detalle_observacion,
      estado: updateObservacioneDto.estado ?? observacion.estado,
      respuesta_digitador: updateObservacioneDto.respuesta_digitador ?? observacion.respuesta_digitador,
      fecha_observacion: updateObservacioneDto.fecha_observacion ?? observacion.fecha_observacion,
      fecha_respuesta: updateObservacioneDto.fecha_respuesta ?? observacion.fecha_respuesta,
    });
    return this.observacionRepository.save(observacion);
  }

  async remove(id: number): Promise<{ message: string; status: HttpStatus }> {
    const observacion = await this.observacionRepository.findOne({ where: { id, estado: Not(0) } });
    if (!observacion) {
      throw new HttpException(`Observación con id ${id} no encontrada`, HttpStatus.NOT_FOUND);
    }
    observacion.estado = 0;
    const deleteUser =await this.observacionRepository.save(observacion);
    if (!deleteUser) {
      throw new HttpException('Error al eliminar la observación', HttpStatus.BAD_REQUEST);
    }
    return{
      message: `Observación con id ${id} eliminada correctamente`,
      status: HttpStatus.OK,
    }
  }
async countToday() {
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

  const count = await this.observacionRepository.count({
    where: {
      id: Not(0),
      fecha_observacion: Between(startOfDay, endOfDay), // Asegurarse de que la observación esté activa
    },
  });

  return {
    count,
    message: `Total de observaciones creados hoy: ${count}`,
    status: HttpStatus.OK,
  };
}



async countByMonthCurrentYear() {
  const currentYear = new Date().getFullYear();
  const result = await this.observacionRepository
    .createQueryBuilder('observacion')
    .select("MONTH(observacion.fecha_observacion)", "month")
    .addSelect("COUNT(*)", "count")
    .where("YEAR(observacion.fecha_observacion) = :year", { year: currentYear })
    .andWhere("observacion.estado != 0")
    .groupBy("month")
    .orderBy("month", "ASC")
    .getRawMany();

  // Map result to array of 12 months, filling missing months with 0
  const counts = Array(12).fill(0);
  result.forEach(row => {
    const monthIndex = Number(row.month) - 1;
    counts[monthIndex] = Number(row.count);
  });
    
  return {
    year: currentYear,
    counts,
    message: `Cantidad de observaciones por mes en el año ${currentYear}`,
    status: HttpStatus.OK,
  };
}
}
