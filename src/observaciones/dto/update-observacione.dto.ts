import { PartialType } from '@nestjs/mapped-types';
import { CreateObservacionDto } from './create-observacione.dto';

export class UpdateObservacioneDto extends PartialType(CreateObservacionDto) {}
