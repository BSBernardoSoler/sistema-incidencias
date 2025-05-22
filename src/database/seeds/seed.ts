import { User } from '../../usuarios/entities/usuario.entity';
import {  Role } from '../../roles/entities/role.entity';
import { Registro } from '../../registros/entities/registro.entity';
import { Meta } from '../../metas/entities/meta.entity';
import { Observacion } from '../../observaciones/entities/observacione.entity';
import { HistorialCambio } from '../../historial-cambios/entities/historial-cambio.entity';
import { Alerta } from '../../alertas/entities/alerta.entity';
import { DataSource } from 'typeorm';



const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'incidencias_db',
  entities: [User, Role, Meta, Registro, Alerta, Observacion, HistorialCambio],
  synchronize: false,
});

const seed = async () => {
  await AppDataSource.initialize();

  const rolRepo = AppDataSource.getRepository(Role);
  const usuarioRepo = AppDataSource.getRepository(User);
  const registroRepo = AppDataSource.getRepository(Registro);
  const alertaRepo = AppDataSource.getRepository(Alerta);
  const observacionRepo = AppDataSource.getRepository(Observacion);
  const cambioRepo = AppDataSource.getRepository(HistorialCambio);
  const metaRepo = AppDataSource.getRepository(Meta);

  // Roles
  await rolRepo.save([
    { id: 1, nombre: 'digitador', descripcion: 'rol digitador', estado: 1 },
    { id: 2, nombre: 'admin', descripcion: 'rol admin', estado: 1 },
    { id: 3, nombre: 'doctor', descripcion: 'rol doctor', estado: 1 },
    { id: 4, nombre: 'revisor', descripcion: 'rol revisor', estado: 1 },
    { id: 5, nombre: 'supervisor', descripcion: 'rol supervisor', estado: 1 },
    { id: 6, nombre: 'coordinador', descripcion: 'rol coordinador', estado: 1 },
    { id: 7, nombre: 'gestor', descripcion: 'rol gestor', estado: 1 },
    { id: 8, nombre: 'analista', descripcion: 'rol analista', estado: 1 },
    { id: 9, nombre: 'consultor', descripcion: 'rol consultor', estado: 1 },
    { id: 10, nombre: 'editor', descripcion: 'rol editor', estado: 1 },
  ]);

  // Usuarios
  const usuarios = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    nombres: `Usuario${i + 1}`,
    apellidos: `Apellido${i + 1}`,
    dni: `1234567${i + 1}`,
    correo: `usuario${i + 1}@test.com`,
    password: 'hash_password',
    estado: 1,
    fecha_ingreso: new Date('2025-05-0' + ((i % 9) + 1)),
    rol: { id: ((i % 10) + 1) },
  }));
  await usuarioRepo.save(usuarios);

  // Registros digitados
  const registros = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    fecha_digitacion: new Date('2025-05-' + ((i % 28) + 1)),
    cantidad_registros: 50 + i,
    hora_inicio: '08:00',
    hora_fin: '10:00',
    estado_validacion: 'validado',
    observaciones: 'Observación ' + (i + 1),
    estado: 1,
    usuario: { id: ((i % 10) + 1) },
  }));
  await registroRepo.save(registros);

  // Alertas
  const alertas = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    tipo_alerta: 'Tipo ' + (i + 1),
    descripcion: 'Descripción alerta ' + (i + 1),
    fecha_generada: new Date('2025-05-01T0' + (i % 9) + ':00:00'),
    resuelta: (i % 2) === 1,
    estado: 1,
    registro: { id: ((i % 10) + 1) },
  }));
  await alertaRepo.save(alertas);

  // Observaciones
  const observaciones = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    detalle_observacion: 'Detalle ' + (i + 1),
    estado: 1,
    respuesta_digitador: 'Respuesta ' + (i + 1),
    fecha_observacion: new Date('2025-05-01T0' + (i % 9) + ':00:00'),
    fecha_respuesta: new Date('2025-05-01T1' + (i % 9) + ':00:00'),
    registro: { id: ((i % 10) + 1) },
    usuarioReporta: { id: ((i % 10) + 1) },
  }));
  await observacionRepo.save(observaciones);

  // Historial de cambios
  const cambios = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    campo_modificado: 'campo_' + (i + 1),
    valor_anterior: 'valor_ant_' + (i + 1),
    valor_nuevo: 'valor_nuevo_' + (i + 1),
    fecha_modificacion: new Date('2025-05-01T0' + (i % 9) + ':00:00'),
    estado: 1,
    registro: { id: ((i % 10) + 1) },
    usuarioModifica: { id: ((i % 10) + 1) },
  }));
  await cambioRepo.save(cambios);

  // Metas
  const metas = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    mes: '0' + ((i % 12) + 1),
    meta_diaria: 100 + i,
    meta_mensual: 3000 + i * 10,
    estado: 1,
    usuario: { id: ((i % 10) + 1) },
    fecha_registro: new Date('2025-05-06T06:' + (10 + i) + ':07Z'),
  }));
  await metaRepo.save(metas);

  console.log('✅ Base de datos llenada con 10 filas por cada tabla.');
  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Error al ejecutar la seed:', err);
  process.exit(1);
});