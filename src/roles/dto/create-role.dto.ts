// roles/dto/create-role.dto.ts
import { IsNotEmpty, IsString, IsOptional, IsInt, Min } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;


  @IsOptional()
  @IsInt()
  @Min(1)
  estado?: number;
}
