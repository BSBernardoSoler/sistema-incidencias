// roles.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

describe('RolesController', () => {
  let controller: RolesController;
  let service: RolesService;

  const mockRolesService = {
    create: jest.fn(dto => ({ id: 1, ...dto })),
    findAll: jest.fn(() => [
      { id: 1, nombre: 'Admin', estado: 1 },
      { id: 2, nombre: 'User', estado: 1 },
    ]),
    findOne: jest.fn(id => ({ id, nombre: 'Admin', estado: 1 })),
    update: jest.fn((id, dto) => ({ id, ...dto })),
    remove: jest.fn(id => ({ message: 'Rol eliminado correctamente' })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        {
          provide: RolesService,
          useValue: mockRolesService,
        },
      ],
    }).compile();

    controller = module.get<RolesController>(RolesController);
    service = module.get<RolesService>(RolesService);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('debería crear un rol', async () => {
    const dto: CreateRoleDto = { nombre: 'Admin' };
    expect(await controller.create(dto)).toEqual({ id: 1, ...dto });
    expect(mockRolesService.create).toHaveBeenCalledWith(dto);
  });

  it('debería obtener todos los roles', async () => {
    expect(await controller.findAll()).toHaveLength(2);
  });

  it('debería obtener un solo rol', async () => {
    expect(await controller.findOne(1)).toEqual({ id: 1, nombre: 'Admin', estado: 1 });
  });

  it('debería actualizar un rol', async () => {
    const dto: UpdateRoleDto = { nombre: 'Usuario' };
    expect(await controller.update(1, dto)).toEqual({ id: 1, ...dto });
  });

  it('debería eliminar un rol', async () => {
    expect(await controller.remove(1)).toEqual({ message: 'Rol eliminado correctamente' });
  });
});
