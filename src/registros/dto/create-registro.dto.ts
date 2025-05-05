// registros/dto/create-registro.dto.ts
import { IsNotEmpty, IsInt, IsDateString, IsString, IsOptional } from 'class-validator';

export class CreateRegistroDto {
  @IsInt()
  usuario_id: number;

  @IsDateString()
  fecha_digitacion: string;

  @IsInt()
  cantidad_registros: number;

  @IsNotEmpty()
  @IsString()
  hora_inicio: string;

  @IsNotEmpty()
  @IsString()
  hora_fin: string;

  @IsString()
  estado_validacion: string;

  @IsOptional()
  @IsString()
  observaciones?: string;
}
