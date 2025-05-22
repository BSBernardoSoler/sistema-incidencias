import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRegistroDto } from './dto/create-registro.dto';
import { UpdateRegistroDto } from './dto/update-registro.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Registro } from './entities/registro.entity';
import { Repository } from 'typeorm';
import { User } from 'src/usuarios/entities/usuario.entity';

@Injectable()
export class RegistrosService {
  constructor(
    @InjectRepository(Registro)
    private readonly registroRepository: Repository<Registro>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createRegistroDto: CreateRegistroDto): Promise<Registro> {
    // Validación de usuario
    const usuario = await this.userRepository.findOne({
      where: { id: createRegistroDto.usuario_id },
    });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const registro = this.registroRepository.create({
      ...createRegistroDto,
      usuario,
    });
    return this.registroRepository.save(registro);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ data: Registro[]; total: number; page: number; limit: number }> {
    const [data, total] = await this.registroRepository.findAndCount({
      relations: ['usuario', 'observacionesList', 'cambios', 'alertas'],
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'DESC' },
    });
    return { data, total, page, limit };
  }

  async findOne(id: number): Promise<Registro> {
    const registro = await this.registroRepository.findOne({
      where: { id },
      relations: ['usuario', 'observacionesList', 'cambios', 'alertas'],
    });
    if (!registro) {
      throw new NotFoundException(`Registro #${id} no encontrado`);
    }
    return registro;
  }

  async update(id: number, updateRegistroDto: UpdateRegistroDto): Promise<Registro> {
    const registro = await this.registroRepository.findOne({ where: { id } });
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
    return this.registroRepository.save(registro);
  }

  async remove(id: number): Promise<void> {
    const result = await this.registroRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Registro #${id} no encontrado`);
    }
  }
}
