import { Test, TestingModule } from '@nestjs/testing';
import { ObservacionesService } from './observaciones.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Observacion } from './entities/observacione.entity';
import { Registro } from '../registros/entities/registro.entity';
import { User } from '../usuarios/entities/usuario.entity';
import { Repository } from 'typeorm';
import { AlertasWebsocketsGateway } from 'src/alertas-websockets/alertas-websockets.gateway';

describe('ObservacionesService', () => {
  let service: ObservacionesService;

  const mockRepo = () => ({
    findOne: jest.fn(),
    save: jest.fn(),
    findAndCount: jest.fn(),
    create: jest.fn(),
  });

  const mockGateway = {
    notifyClient: jest.fn(),
  };

  const observacionRepo = mockRepo();
  const registroRepo = mockRepo();
  const usuarioRepo = mockRepo();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ObservacionesService,
        { provide: getRepositoryToken(Observacion), useValue: observacionRepo },
        { provide: getRepositoryToken(Registro), useValue: registroRepo },
        { provide: getRepositoryToken(User), useValue: usuarioRepo },
        { provide: AlertasWebsocketsGateway, useValue: mockGateway },
      ],
    }).compile();

    service = module.get<ObservacionesService>(ObservacionesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an observación', async () => {
    const dto = {
      detalle_observacion: 'Test',
      registro_id: 1,
      usuario_reporta_id: 1,
    } as any;

    registroRepo.findOne.mockResolvedValue({ id: 1 });
    usuarioRepo.findOne.mockResolvedValue({ id: 1 });
    observacionRepo.create.mockReturnValue(dto);
    observacionRepo.save.mockResolvedValue({ id: 1 });

    const result = await service.create(dto);
    expect(result.id).toBe(1);
  });

  it('should throw if registro not found', async () => {
    registroRepo.findOne.mockResolvedValue(null);
    await expect(
      service.create({ registro_id: 1, usuario_reporta_id: 1 } as any),
    ).rejects.toThrow('Registro no encontrado');
  });

  it('should throw if usuario not found', async () => {
    registroRepo.findOne.mockResolvedValue({ id: 1 });
    usuarioRepo.findOne.mockResolvedValue(null);
    await expect(
      service.create({ registro_id: 1, usuario_reporta_id: 1 } as any),
    ).rejects.toThrow('Usuario no encontrado');
  });

  it('should find all observaciones paginated', async () => {
    observacionRepo.findAndCount.mockResolvedValue([[{ id: 1 }], 1]);
    const result = await service.findAll(1, 10);
    expect(result.total).toBe(1);
    expect(result.data).toHaveLength(1);
  });

  it('should find one observacion', async () => {
    observacionRepo.findOne.mockResolvedValue({ id: 1 });
    const result = await service.findOne(1);
    expect(result.id).toBe(1);
  });

  it('should update observacion', async () => {
    observacionRepo.findOne.mockResolvedValue({ id: 1 });
    observacionRepo.save.mockResolvedValue({ id: 1 });
    const result = await service.update(1, {} as any);
    expect(result.id).toBe(1);
  });

  it('should remove observacion', async () => {
    observacionRepo.findOne.mockResolvedValue({ id: 1 });
    observacionRepo.save.mockResolvedValue({ id: 1, estado: 0 });

    const result = await service.remove(1);
    expect(result.message).toContain('eliminada correctamente');
  });
});
