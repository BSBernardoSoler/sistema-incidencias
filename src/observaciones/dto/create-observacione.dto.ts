// observaciones/dto/create-observacion.dto.ts
import { IsNotEmpty, IsInt, IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateObservacionDto {
  @IsInt()
  registro_id: number;

  @IsInt()
  usuario_reporta_id: number;

  @IsString()
  detalle_observacion: string;

  @IsOptional()
  @IsInt()
  estado?: number;

  @IsOptional()
  @IsString()
  respuesta_digitador?: string;

  @IsDateString()
  fecha_observacion: string;

  @IsOptional()
  @IsDateString()
  fecha_respuesta?: string;
}
