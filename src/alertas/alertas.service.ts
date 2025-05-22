import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlertaDto } from './dto/create-alerta.dto';
import { UpdateAlertaDto } from './dto/update-alerta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Alerta } from './entities/alerta.entity';
import { Repository } from 'typeorm';
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

  async findAll(): Promise<Alerta[]> {
    return this.alertaRepository.find({
      where: { estado: 1 },
      relations: ['registro'],
    });
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

  async remove(id: number): Promise<void> {
    const alerta = await this.alertaRepository.findOne({ where: { id, estado: 1 } });
    if (!alerta) {
      throw new NotFoundException('Alerta no encontrada');
    }
    alerta.estado = 0;
    await this.alertaRepository.save(alerta);
  }
}
