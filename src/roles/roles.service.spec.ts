import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('RolesService', () => {
  let service: RolesService;
  let repo: Repository<Role>;

  const mockRoleRepository = {
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: getRepositoryToken(Role),
          useValue: mockRoleRepository,
        },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
    repo = module.get<Repository<Role>>(getRepositoryToken(Role));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new role', async () => {
      const dto = { nombre: 'Admin' };
      mockRoleRepository.findOne.mockResolvedValue(null);
      mockRoleRepository.create.mockReturnValue(dto);
      mockRoleRepository.save.mockResolvedValue({ id: 1, ...dto });

      const result = await service.create(dto);
      expect(result).toEqual({ id: 1, ...dto });
    });

    it('should throw if role with same name exists', async () => {
      const dto = { nombre: 'Admin' };
      mockRoleRepository.findOne.mockResolvedValue(dto);

      await expect(service.create(dto)).rejects.toThrow(HttpException);
    });
  });

  describe('findAll', () => {
    it('should return all roles', async () => {
      const roles = [{ id: 1, nombre: 'Admin', estado: 1 }];
      mockRoleRepository.find.mockResolvedValue(roles);

      const result = await service.findAll();
      expect(result).toEqual(roles);
    });

    it('should throw if no roles found', async () => {
      mockRoleRepository.find.mockResolvedValue([]);
      await expect(service.findAll()).rejects.toThrow(HttpException);
    });
  });

  describe('findOne', () => {
    it('should return one role by id', async () => {
      const role = { id: 1, nombre: 'User' };
      mockRoleRepository.findOneBy.mockResolvedValue(role);

      const result = await service.findOne(1);
      expect(result).toEqual(role);
    });

    it('should throw if role not found', async () => {
      mockRoleRepository.findOneBy.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(HttpException);
    });
  });

  describe('update', () => {
    it('should update a role', async () => {
      const existing = { id: 1, nombre: 'User' };
      const updated = { nombre: 'UpdatedUser' };
      mockRoleRepository.findOneBy.mockResolvedValue(existing);
      mockRoleRepository.save.mockResolvedValue({ ...existing, ...updated });

      const result = await service.update(1, updated);
      expect(result).toEqual({ ...existing, ...updated });
    });

    it('should throw if role not found', async () => {
      mockRoleRepository.findOneBy.mockResolvedValue(null);
      await expect(service.update(1, { nombre: 'Test' })).rejects.toThrow(HttpException);
    });
  });

  describe('remove', () => {
    it('should delete a role', async () => {
      const role = { id: 1, nombre: 'ToDelete' };
      mockRoleRepository.findOneBy.mockResolvedValue(role);
      mockRoleRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);
      expect(result).toEqual({ affected: 1 });
    });

    it('should throw if role not found', async () => {
      mockRoleRepository.findOneBy.mockResolvedValue(null);
      await expect(service.remove(1)).rejects.toThrow(HttpException);
    });

    it('should throw if delete fails', async () => {
      const role = { id: 1, nombre: 'ToDelete' };
      mockRoleRepository.findOneBy.mockResolvedValue(role);
      mockRoleRepository.delete.mockResolvedValue({ affected: 0 });
      await expect(service.remove(1)).rejects.toThrow(HttpException);
    });
  });
});
