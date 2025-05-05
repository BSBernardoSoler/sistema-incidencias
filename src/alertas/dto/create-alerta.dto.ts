// alertas/dto/create-alerta.dto.ts
import { IsNotEmpty, IsInt, IsString, IsBoolean, IsDateString, IsOptional } from 'class-validator';

export class CreateAlertaDto {
  @IsInt()
  registro_id: number;

  @IsNotEmpty()
  @IsString()
  tipo_alerta: string;

  @IsString()
  descripcion: string;

  @IsDateString()
  fecha_generada: string;

  @IsBoolean()
  resuelta: boolean;

  @IsOptional()
  @IsInt()
  estado?: number;


}
