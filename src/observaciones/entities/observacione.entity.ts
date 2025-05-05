import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Registro } from '../../registros/entities/registro.entity';
import { User } from '../../usuarios/entities/usuario.entity';

@Entity('observaciones')
export class Observacion {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Registro, r => r.observacionesList)
  registro: Registro;

  @ManyToOne(() => User, u => u.observacionesHechas)
  usuarioReporta: User;

  @Column()
  detalle_observacion: string;

  @Column({default: 1})
  estado: number;

  @Column({ nullable: true })
  respuesta_digitador: string;

  @Column()
  fecha_observacion: Date;

  @Column({ nullable: true })
  fecha_respuesta: Date;
}

