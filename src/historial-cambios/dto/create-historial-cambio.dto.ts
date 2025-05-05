// historial-cambios/dto/create-historial-cambio.dto.ts
import { IsNotEmpty, IsInt, IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateHistorialCambioDto {
  @IsInt()
  registro_id: number;

  @IsInt()
  usuario_modifica_id: number;

  @IsNotEmpty()
  @IsString()
  campo_modificado: string;

  @IsString()
  valor_anterior: string;

  @IsString()
  valor_nuevo: string;

  @IsDateString()
  fecha_modificacion: string;


  @IsOptional()
  @IsInt()
  estado?: number;
}



