import { Test, TestingModule } from '@nestjs/testing';
import { RegistrosService } from './registros.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Registro } from './entities/registro.entity';
import { User } from 'src/usuarios/entities/usuario.entity';
import { Repository } from 'typeorm';
import { AlertasWebsocketsGateway } from 'src/alertas-websockets/alertas-websockets.gateway';
import { CreateRegistroDto } from './dto/create-registro.dto';
import { UpdateRegistroDto } from './dto/update-registro.dto';
const mockRegistro = {
    id: 1,
    usuario: { id: 1, nombres: 'Juan', apellidos: 'Pérez' },
    usuario_id: 1,
    fecha_digitacion: '2024-06-01T10:00:00.000Z',
    cantidad_registros: 100,
    hora_inicio: '08:00',
    lote: 'L123',
    hora_fin: '12:00',
    estado_validacion: 'pendiente',
    observaciones: 'Sin observaciones',
    estado: 1,
};

const mockUser = {
  id: 1,
  estado: 1,
  nombres: 'Juan',
  apellidos: 'Pérez',
};

describe('RegistrosService', () => {
  let service: RegistrosService;
  let registroRepo: Partial<Repository<Registro>>;
  let userRepo: Partial<Repository<User>>;
  let notifyClient: jest.Mock;

  beforeEach(async () => {
    registroRepo = {
      findOne: jest.fn().mockResolvedValue(mockRegistro),
      save: jest.fn().mockResolvedValue(mockRegistro),
      findAndCount: jest.fn().mockResolvedValue([[mockRegistro], 1]),
    };

    userRepo = {
      findOne: jest.fn().mockResolvedValue(mockUser),
    };

    notifyClient = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegistrosService,
        { provide: getRepositoryToken(Registro), useValue: registroRepo },
        { provide: getRepositoryToken(User), useValue: userRepo },
        { provide: AlertasWebsocketsGateway, useValue: { notifyClient } },
      ],
    }).compile();

    service = module.get<RegistrosService>(RegistrosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  it('should find all registros', async () => {
    const result = await service.findAll(1, 10);
    expect(result.data).toEqual([mockRegistro]);
    expect(result.total).toBe(1);
  });

  it('should find one registro', async () => {
    const result = await service.findOne(1);
    expect(result).toEqual(mockRegistro);
  });

  it('should update a registro', async () => {
    const dto: UpdateRegistroDto = { lote: 'L999' } as any;
    const result = await service.update(1, dto);
    expect(result).toEqual(mockRegistro);
  });

  it('should remove (soft delete) a registro', async () => {
    const result = await service.remove(1);
    expect(result).toEqual({ message: 'Registro #1 eliminado correctamente', status: 200 });
  });
});
