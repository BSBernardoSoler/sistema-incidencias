import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, Unique, JoinColumn } from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { Meta } from '../../metas/entities/meta.entity';
import { Registro } from '../../registros/entities/registro.entity';
import { Observacion } from '../../observaciones/entities/observacione.entity';
import { HistorialCambio } from '../../historial-cambios/entities/historial-cambio.entity';

@Entity('usuarios')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombres: string;

  @Column()
  apellidos: string;

  @Column()
  @Column({unique: true})
  dni: string;

  @Column({unique: true})
  correo: string;


  @Column({default: null})
  telefono: string;

  
  @Column({default: null})
  condicionLaboral: string;


  @Column({select: false})
  password: string;

  @Column({default: 1})
  estado: number;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  fecha_ingreso: Date;
  
  @ManyToOne(() => Role, rol => rol.usuarios)
  rol: Role;

  @OneToMany(() => Meta, meta => meta.usuario)
  metas: Meta[];

  @OneToMany(() => Registro, r => r.usuario)
  registros: Registro[];

  @OneToMany(() => Observacion, o => o.usuarioReporta)
  observacionesHechas: Observacion[];

  @OneToMany(() => HistorialCambio, h => h.usuarioModifica)
  cambios: HistorialCambio[];
}

