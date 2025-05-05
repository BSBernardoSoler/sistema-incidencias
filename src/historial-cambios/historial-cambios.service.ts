import { Injectable } from '@nestjs/common';
import { CreateHistorialCambioDto } from './dto/create-historial-cambio.dto';
import { UpdateHistorialCambioDto } from './dto/update-historial-cambio.dto';

@Injectable()
export class HistorialCambiosService {
  create(createHistorialCambioDto: CreateHistorialCambioDto) {
    return 'This action adds a new historialCambio';
  }

  findAll() {
    return `This action returns all historialCambios`;
  }

  findOne(id: number) {
    return `This action returns a #${id} historialCambio`;
  }

  update(id: number, updateHistorialCambioDto: UpdateHistorialCambioDto) {
    return `This action updates a #${id} historialCambio`;
  }

  remove(id: number) {
    return `This action removes a #${id} historialCambio`;
  }
}
