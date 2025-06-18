import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateObservacionDto } from './dto/create-observacione.dto';
import { UpdateObservacioneDto } from './dto/update-observacione.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Observacion } from './entities/observacione.entity';
import { Repository } from 'typeorm';
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
    const registro = await this.registroRepository.findOne({ where: { id: createObservacioneDto.registro_id } });
    if (!registro) {
      throw new HttpException('Registro no encontrado', HttpStatus.NOT_FOUND);
    }
    const usuario = await this.userRepository.findOne({ where: { id: createObservacioneDto.usuario_reporta_id } });
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
      relations: ['registro', 'usuarioReporta'],
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'DESC' },
    });
    return { data, total, page, limit };
  }

  async findOne(id: number): Promise<Observacion> {
    const observacion = await this.observacionRepository.findOne({
      where: { id },
      relations: ['registro', 'usuarioReporta'],
    });
    if (!observacion) {
      throw new NotFoundException(`Observación con id ${id} no encontrada`);
    }
    return observacion;
  }

  async update(id: number, updateObservacioneDto: UpdateObservacioneDto): Promise<Observacion> {
    const observacion = await this.observacionRepository.findOne({ where: { id } });
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

  async remove(id: number): Promise<void> {
    const result = await this.observacionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Observación con id ${id} no encontrada`);
    }
  }
}
