import { Test, TestingModule } from '@nestjs/testing';
import { MetasService } from './metas.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Meta } from './entities/meta.entity';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';

describe('MetasService', () => {
  let service: MetasService;
  let metasRepo: jest.Mocked<Repository<Meta>>;
  let usuariosService: jest.Mocked<UsuariosService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MetasService,
        {
          provide: getRepositoryToken(Meta),
          useValue: {
            findOne: jest.fn(),
            findOneBy: jest.fn(),
            findAndCount: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: UsuariosService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(MetasService);
    metasRepo = module.get(getRepositoryToken(Meta));
    usuariosService = module.get(UsuariosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw if usuario not found', async () => {
      usuariosService.findOne.mockResolvedValue(null);
      await expect(service.create({ usuario_id: 1, mes: '6' } as any)).rejects.toThrow(HttpException);
    });

    it('should throw if meta for same month exists', async () => {
      usuariosService.findOne.mockResolvedValue({ id: 1 } as any);
      metasRepo.findOne.mockResolvedValue({
        fecha_registro: new Date(),
        mes: '6',
      } as Partial<Meta> as Meta);

      await expect(service.create({ usuario_id: 1, mes: '6' } as any)).rejects.toThrow(
        'Ya existe una meta de este mes para este usuario'
      );
    });

    it('should create meta', async () => {
      usuariosService.findOne.mockResolvedValue({ id: 1 } as any);
      metasRepo.findOne.mockResolvedValue(null);
      metasRepo.save.mockResolvedValue({ id: 99 } as Meta);

      const dto = { usuario_id: 1, mes: '12' };
      const result = await service.create(dto as any);
      expect(result).toEqual({ id: 99 });
    });
  });

  describe('findAll', () => {
    it('should return paginated metas', async () => {
      metasRepo.findAndCount.mockResolvedValue([[{ id: 1 } as Meta], 1]);
      const result = await service.findAll(1, 10);
      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return undefined if not found', async () => {
      metasRepo.findOneBy.mockResolvedValue(null);
      const result = await service.findOne(1);
      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should throw if not found', async () => {
      metasRepo.findOneBy.mockResolvedValue(null);
      await expect(service.remove(1)).rejects.toThrow('Meta no encontrada');
    });

    it('should return meta with estado = 0', async () => {
      metasRepo.findOneBy.mockResolvedValue({
        id: 1,
        estado: 1,
        usuario: {},
        mes: '6',
        meta_diaria: 10,
        meta_mensual: 300,
        fecha_registro: new Date(),
      } as Meta);

      metasRepo.save.mockResolvedValue({
        id: 1,
        estado: 0,
        usuario: {},
        mes: '6',
        meta_diaria: 10,
        meta_mensual: 300,
        fecha_registro: new Date(),
      } as Meta);

      const result = await service.remove(1);
      expect(result.estado).toBe(0);
    });
  });
});
