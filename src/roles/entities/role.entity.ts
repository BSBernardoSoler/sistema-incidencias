import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from '../../usuarios/entities/usuario.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;


  @Column({ default: 1 })
  estado: number;

  @OneToMany(() => User, user => user.rol)
  usuarios: User[];
}

