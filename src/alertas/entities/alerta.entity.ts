import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Registro } from '../../registros/entities/registro.entity';

@Entity('alertas')
export class Alerta {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Registro, r => r.alertas)
  registro: Registro;

  @Column()
  tipo_alerta: string;

  @Column()
  descripcion: string;

  @Column()
  fecha_generada: Date;

  @Column()
  resuelta: boolean;

  @Column({ default: 1})
  estado: number;
}

