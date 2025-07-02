// alertas.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AlertasController } from './alertas.controller';
import { AlertasService } from './alertas.service';

describe('AlertasController', () => {
  let controller: AlertasController;
  let service: AlertasService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlertasController],
      providers: [
        {
          provide: AlertasService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<AlertasController>(AlertasController);
    service = module.get<AlertasService>(AlertasService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.create with DTO', async () => {
    const dto = { registro_id: 1 };
    await controller.create(dto as any);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should call findAll with default pagination', async () => {
    await controller.findAll('', '');
    expect(service.findAll).toHaveBeenCalledWith(1, 10);
  });

  it('should call findOne with id', async () => {
    await controller.findOne('5');
    expect(service.findOne).toHaveBeenCalledWith(5);
  });

  it('should call update with id and DTO', async () => {
    await controller.update('5', { test: true } as any);
    expect(service.update).toHaveBeenCalledWith(5, { test: true });
  });

  it('should call remove with id', async () => {
    await controller.remove('5');
    expect(service.remove).toHaveBeenCalledWith(5);
  });
});
