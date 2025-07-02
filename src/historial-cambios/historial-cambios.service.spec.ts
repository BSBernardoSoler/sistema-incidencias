// historial-cambios.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { HistorialCambiosService } from './historial-cambios.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HistorialCambio } from './entities/historial-cambio.entity';
import { Registro } from '../registros/entities/registro.entity';
import { User } from '../usuarios/entities/usuario.entity';
import { Repository } from 'typeorm';
import { AlertasWebsocketsGateway } from 'src/alertas-websockets/alertas-websockets.gateway';

describe('HistorialCambiosService', () => {
  let service: HistorialCambiosService;
  let mockAlertaGateway: AlertasWebsocketsGateway;

  const mockRepo = <T = any>() => ({
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    findAndCount: jest.fn(),
  });

  const historialCambioRepo = mockRepo();
  const registroRepo = mockRepo();
  const usuarioRepo = mockRepo();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HistorialCambiosService,
        { provide: getRepositoryToken(HistorialCambio), useValue: historialCambioRepo },
        { provide: getRepositoryToken(Registro), useValue: registroRepo },
        { provide: getRepositoryToken(User), useValue: usuarioRepo },
        {
          provide: AlertasWebsocketsGateway,
          useValue: {
            notifyClient: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<HistorialCambiosService>(HistorialCambiosService);
    mockAlertaGateway = module.get(AlertasWebsocketsGateway);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw error if registro no existe', async () => {
      registroRepo.findOne.mockResolvedValue(null);
      await expect(service.create({ registro_id: 1 } as any)).rejects.toThrow('Registro no encontrado');
    });

    it('should throw error if usuario no existe', async () => {
      registroRepo.findOne.mockResolvedValue({});
      usuarioRepo.findOne.mockResolvedValue(null);
      await expect(service.create({ registro_id: 1, usuario_modifica_id: 2 } as any)).rejects.toThrow('Usuario no encontrado');
    });

    it('should create historialCambio', async () => {
      registroRepo.findOne.mockResolvedValue({ id: 1 });
      usuarioRepo.findOne.mockResolvedValue({ id: 2 });
      historialCambioRepo.create.mockReturnValue({ id: 99 });
      historialCambioRepo.save.mockResolvedValue({ id: 99 });

      const dto = {
        registro_id: 1,
        usuario_modifica_id: 2,
        campo_modificado: 'nombre',
        valor_anterior: 'A',
        valor_nuevo: 'B',
        fecha_modificacion: new Date(),
      };

      const result = await service.create(dto as any);
      expect(result).toEqual({ id: 99 });
      expect(mockAlertaGateway.notifyClient).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should throw if not found', async () => {
      historialCambioRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow('HistorialCambio no encontrado');
    });
  });

  describe('remove', () => {
    it('should throw if not found', async () => {
      historialCambioRepo.findOne.mockResolvedValue(null);
      await expect(service.remove(1)).rejects.toThrow('HistorialCambio no encontrado');
    });
  });
});
