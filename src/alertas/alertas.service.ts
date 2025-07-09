import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlertaDto } from './dto/create-alerta.dto';
import { UpdateAlertaDto } from './dto/update-alerta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Alerta } from './entities/alerta.entity';
import { Not, Repository } from 'typeorm';
import { Registro } from 'src/registros/entities/registro.entity';

@Injectable()
export class AlertasService {
  constructor(
    @InjectRepository(Alerta)
    private readonly alertaRepository: Repository<Alerta>,
    @InjectRepository(Registro)
    private readonly registroRepository: Repository<Registro>,
  ) {}

  async create(createAlertaDto: CreateAlertaDto): Promise<Alerta> {
    // Validación: verificar que el registro existe
    const registro = await this.registroRepository.findOne({
      where: { id: createAlertaDto.registro_id, estado: 1 },
    });
    if (!registro) {
      throw new NotFoundException('Registro no encontrado');
    }

    const alerta = this.alertaRepository.create({
      ...createAlertaDto,
      registro,
    });
    return this.alertaRepository.save(alerta);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ data: Alerta[]; total: number; page: number; limit: number }> {
    const [data, total] = await this.alertaRepository.findAndCount({
      where: { estado: Not(0) },
      order: { id: 'DESC' },
      relations: ['registro'],
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit };
  }

  async findOne(id: number): Promise<Alerta> {
    const alerta = await this.alertaRepository.findOne({
      where: { id, estado: 1 },
      relations: ['registro'],
    });
    if (!alerta) {
      throw new NotFoundException('Alerta no encontrada');
    }
    return alerta;
  }

  async update(id: number, updateAlertaDto: UpdateAlertaDto): Promise<Alerta> {
    const alerta = await this.alertaRepository.findOne({ where: { id, estado: 1 } });
    if (!alerta) {
      throw new NotFoundException('Alerta no encontrada');
    }

    if (updateAlertaDto.registro_id) {
      const registro = await this.registroRepository.findOne({
        where: { id: updateAlertaDto.registro_id, estado: 1 },
      });
      if (!registro) {
        throw new NotFoundException('Registro no encontrado');
      }
      alerta.registro = registro;
    }

    Object.assign(alerta, updateAlertaDto);
    return this.alertaRepository.save(alerta);
  }

  async remove(id: number) {
    const alerta = await this.alertaRepository.findOne({ where: { id, estado: 1 } });
    if (!alerta) {
      throw new HttpException('Alerta no encontrada', HttpStatus.NOT_FOUND);
    }
    alerta.estado = 0;
    const userdelete = await this.alertaRepository.save(alerta);
    if (!userdelete) {
      throw new HttpException('Error al eliminar la alerta', HttpStatus.BAD_REQUEST);
    }

    return{
      message: 'Alerta eliminada correctamente',
      alerta: userdelete,
    }
  }

  async findAllAlerts(): Promise<any[]> {
  return this.alertaRepository.find({
    relations: ['registro'],
    order: {
      fecha_generada: 'DESC',
    }
  });
}

}
