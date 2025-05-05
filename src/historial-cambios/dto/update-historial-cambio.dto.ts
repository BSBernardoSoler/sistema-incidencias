import { PartialType } from '@nestjs/mapped-types';
import { CreateHistorialCambioDto } from './create-historial-cambio.dto';

export class UpdateHistorialCambioDto extends PartialType(CreateHistorialCambioDto) {}
