import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Registro } from '../../registros/entities/registro.entity';
import { User } from '../../usuarios/entities/usuario.entity';

@Entity('historial_cambios')
export class HistorialCambio {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Registro, r => r.cambios)
  registro: Registro;

  @ManyToOne(() => User, u => u.cambios)
  usuarioModifica: User;

  @Column()
  campo_modificado: string;

  @Column()
  valor_anterior: string;

  @Column()
  valor_nuevo: string;

  @Column()
  fecha_modificacion: Date;

  @Column({ default: 1 })
  estado: number;
}

