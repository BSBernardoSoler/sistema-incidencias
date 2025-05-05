import { Injectable } from '@nestjs/common';
import { CreateObservacionDto } from './dto/create-observacione.dto';
import { UpdateObservacioneDto } from './dto/update-observacione.dto';

@Injectable()
export class ObservacionesService {
  create(createObservacioneDto: CreateObservacionDto) {
    return 'This action adds a new observacione';
  }

  findAll() {
    return `This action returns all observaciones`;
  }

  findOne(id: number) {
    return `This action returns a #${id} observacione`;
  }

  update(id: number, updateObservacioneDto: UpdateObservacioneDto) {
    return `This action updates a #${id} observacione`;
  }

  remove(id: number) {
    return `This action removes a #${id} observacione`;
  }
}
