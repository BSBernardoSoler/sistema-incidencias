// metas/dto/create-meta.dto.ts
import { IsNotEmpty, IsInt, IsDateString, IsString, IsOptional } from 'class-validator';

export class CreateMetaDto {
  @IsInt()
  usuario_id: number;

  @IsNotEmpty()
  @IsString()
  mes: string;

  @IsNotEmpty()
  @IsInt()
  meta_diaria: number;

  @IsNotEmpty()
  @IsInt()
  meta_mensual: number;

  @IsOptional()
  @IsInt()
  estado?: number;
}
