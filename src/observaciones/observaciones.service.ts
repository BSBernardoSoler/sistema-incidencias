import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateObservacionDto } from './dto/create-observacione.dto';
import { UpdateObservacioneDto } from './dto/update-observacione.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Observacion } from './entities/observacione.entity';
import { Repository } from 'typeorm';
import { Registro } from 'src/registros/entities/registro.entity';
import { User } from 'src/usuarios/entities/usuario.entity';

@Injectable()
export class ObservacionesService {
  constructor(
    @InjectRepository(Observacion)
    private readonly observacionRepository: Repository<Observacion>,
    @InjectRepository(Registro)
    private readonly registroRepository: Repository<Registro>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createObservacioneDto: CreateObservacionDto): Promise<Observacion> {
    // Validar existencia de registro y usuario
    const registro = await this.registroRepository.findOne({ where: { id: createObservacioneDto.registro_id } });
    if (!registro) {
      throw new NotFoundException('Registro no encontrado');
    }
    const usuario = await this.userRepository.findOne({ where: { id: createObservacioneDto.usuario_reporta_id } });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
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
    return this.observacionRepository.save(observacion);
  }

  async findAll(): Promise<Observacion[]> {
    return this.observacionRepository.find({ relations: ['registro', 'usuarioReporta'] });
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
