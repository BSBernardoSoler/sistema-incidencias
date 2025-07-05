import { forwardRef, HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRegistroDto } from './dto/create-registro.dto';
import { UpdateRegistroDto } from './dto/update-registro.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Registro } from './entities/registro.entity';
import { Between, Not, Repository } from 'typeorm';
import { User } from 'src/usuarios/entities/usuario.entity';
import { AlertasWebsocketsGateway } from 'src/alertas-websockets/alertas-websockets.gateway';
import { date } from 'joi';

@Injectable()
export class RegistrosService {
  constructor(
    @InjectRepository(Registro)
    private readonly registroRepository: Repository<Registro>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => AlertasWebsocketsGateway)) 
    private readonly alertasWebsocketsGateWay: AlertasWebsocketsGateway, // Inject the AlertasWebsocketsService
  ) {}

  async create(createRegistroDto: CreateRegistroDto): Promise<Registro> {
    // Validación de usuario
    const usuario = await this.userRepository.findOne({
      where: { id: createRegistroDto.usuario_id, estado: Not(0) }, // Asegurarse de que el usuario esté activo
    });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const registro = this.registroRepository.create({
      ...createRegistroDto,
      usuario,
    });

    const newRegistro = await this.registroRepository.save(registro)
    if (!newRegistro) {
      throw new HttpException('Error al crear el registro', HttpStatus.BAD_REQUEST);
    }
    this.alertasWebsocketsGateWay.notifyClient(newRegistro, `Nuevo registro creado con el lote ${newRegistro.lote} por el usuario ${usuario.nombres} ${usuario.apellidos}`, 'info');
    return newRegistro;
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ data: Registro[]; total: number; page: number; limit: number }> {
    const [data, total] = await this.registroRepository.findAndCount({
      where: { estado: Not(0) }, // Filtrar registros activos
      relations: ['usuario', 'observacionesList', 'cambios', 'alertas'],
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'DESC' },
    });
    return { data, total, page, limit };
  }

  async findOne(id: number): Promise<Registro> {
    const registro = await this.registroRepository.findOne({
      where: { id , estado: Not(0) },
      relations: ['usuario'],
    });
    if (!registro) {
      throw new NotFoundException(`Registro #${id} no encontrado`);
    }
    return registro;
  }

  async update(id: number, updateRegistroDto: UpdateRegistroDto): Promise<Registro> {
    const registro = await this.registroRepository.findOne({ where: { id , estado: Not(0) } });
    if (!registro) {
      throw new NotFoundException(`Registro #${id} no encontrado`);
    }

    if (updateRegistroDto.usuario_id) {
      const usuario = await this.userRepository.findOne({
        where: { id: updateRegistroDto.usuario_id },
      });
      if (!usuario) {
        throw new NotFoundException('Usuario no encontrado');
      }
      registro.usuario = usuario;
    }

    Object.assign(registro, updateRegistroDto);
    const updatedRegistro = await this.registroRepository.save(registro);
    if (!updatedRegistro) {
      throw new HttpException('Error al actualizar el registro', HttpStatus.BAD_REQUEST);
    }
    this.alertasWebsocketsGateWay.notifyClient(updatedRegistro, `Registro actualizado numero ${updatedRegistro.id}`, 'info');
    return updatedRegistro;

  }
  async remove(id: number): Promise<{ message: string; status: HttpStatus }> {
    const registro = await this.registroRepository.findOne({ where: { id , estado: Not(0) } });
    if (!registro) {
      throw new HttpException(`Registro #${id} no encontrado`, HttpStatus.NOT_FOUND);
    }
    registro.estado = 0;
    const resultado = await this.registroRepository.save(registro);
    if (!resultado) {
      throw new HttpException('Error al eliminar el registro', HttpStatus.BAD_REQUEST);
    }
    return {
      message: `Registro #${id} eliminado correctamente`,
      status: HttpStatus.OK,
    }
  }


async countToday(): Promise<{ count: number; message: string; status: HttpStatus }> {
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

  const count = await this.registroRepository.count({
    where: {
      id: Not(0), // Asegurarse de que el registro esté activo
      fecha_digitacion: Between(startOfDay, endOfDay), // Asegurarse de que la fecha de creación esté dentro del día actual
    },
  });

  return {
    count,
    message: `Total de registros creados hoy: ${count}`,
    status: HttpStatus.OK,
  };
}


async calcularProductividad(usuarioId: number, fecha: Date): Promise<{ productividad: number; total: number; message: string; status: HttpStatus }> {
  const startOfDay = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), 0, 0, 0);
  const endOfDay = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), 23, 59, 59);

  const total = await this.registroRepository.count({
    where: {
      usuario: { id: usuarioId },
      estado: Not(0),
      fecha_digitacion: Between(startOfDay, endOfDay),
    },
  });

  // Puedes definir la productividad como el total de registros digitados en el día
  const productividad = total;

  return {
    productividad,
    total,
    message: `Productividad del usuario #${usuarioId} el ${fecha.toLocaleDateString()}: ${productividad} registros digitados`,
    status: HttpStatus.OK,
  };
}


async countByMetasPorMes(usuarioId: number): Promise<{ [mes: string]: number }> {
  const year = new Date().getFullYear();
  const result: { [mes: string]: number } = {};

  for (let mes = 0; mes < 12; mes++) {
    const startOfMonth = new Date(year, mes, 1, 0, 0, 0);
    const endOfMonth = new Date(year, mes + 1, 0, 23, 59, 59);

    const count = await this.registroRepository.count({
      where: {
        usuario: { id: usuarioId },
        estado: Not(0),
        fecha_digitacion: Between(startOfMonth, endOfMonth),
        
      },
    });

    // Mes en formato "01", "02", ..., "12"
    const mesStr = (mes + 1).toString().padStart(2, '0');
    result[mesStr] = count;
  }

  return result;
}
}
