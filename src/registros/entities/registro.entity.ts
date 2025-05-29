import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../usuarios/entities/usuario.entity';
import { Observacion } from '../../observaciones/entities/observacione.entity';
import { HistorialCambio } from '../../historial-cambios/entities/historial-cambio.entity';
import { Alerta } from '../../alertas/entities/alerta.entity';

@Entity('registros_digitados')
export class Registro {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.registros)
  usuario: User;

  @Column({ type: 'date' })
  fecha_digitacion: Date;

  @Column()
  cantidad_registros: number;

  @Column()
  hora_inicio: string;

  @Column()
  hora_fin: string;

  @Column()
  estado_validacion: string;

  @Column({ nullable: true })
  observaciones: string;

  @Column({ default: null })
  lote : string;

  @Column({ default: 1 })   
  estado: number;

  @OneToMany(() => Observacion, o => o.registro)
  observacionesList: Observacion[];

  @OneToMany(() => HistorialCambio, h => h.registro)
  cambios: HistorialCambio[];

  @OneToMany(() => Alerta, a => a.registro)
  alertas: Alerta[];
}

