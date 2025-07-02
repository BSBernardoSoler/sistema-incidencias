// alertas.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AlertasService } from './alertas.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Alerta } from './entities/alerta.entity';
import { Registro } from 'src/registros/entities/registro.entity';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

describe('AlertasService', () => {
  let service: AlertasService;
  let alertaRepo: jest.Mocked<Repository<Alerta>>;
  let registroRepo: jest.Mocked<Repository<Registro>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlertasService,
        {
          provide: getRepositoryToken(Alerta),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            findAndCount: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Registro),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(AlertasService);
    alertaRepo = module.get(getRepositoryToken(Alerta));
    registroRepo = module.get(getRepositoryToken(Registro));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw if registro not found', async () => {
      registroRepo.findOne.mockResolvedValue(null);
      await expect(service.create({ registro_id: 1 } as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return paginated alertas', async () => {
      alertaRepo.findAndCount.mockResolvedValue([[{ id: 1 } as Alerta], 1]);
      const result = await service.findAll(1, 10);
      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should throw if not found', async () => {
      alertaRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should throw if not found', async () => {
      alertaRepo.findOne.mockResolvedValue(null);
      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
