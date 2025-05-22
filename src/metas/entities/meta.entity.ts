import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../usuarios/entities/usuario.entity';

@Entity('metas')
export class Meta {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.metas)
  usuario: User;

  @Column()
  mes: string;

  @Column()
  meta_diaria: number;

  @Column()
  meta_mensual: number;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_registro: Date;

  @Column({ default: 1})
  estado: number;
}

