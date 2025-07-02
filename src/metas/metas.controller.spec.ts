// metas.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { MetasController } from './metas.controller';
import { MetasService } from './metas.service';

describe('MetasController', () => {
  let controller: MetasController;
  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetasController],
      providers: [{ provide: MetasService, useValue: mockService }],
    }).compile();

    controller = module.get<MetasController>(MetasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.create', async () => {
    const dto = { mes: '6' };
    await controller.create(dto as any);
    expect(mockService.create).toHaveBeenCalledWith(dto);
  });

  it('should call service.findAll with default pagination', async () => {
    await controller.findAll("", "");
    expect(mockService.findAll).toHaveBeenCalledWith(1, 10);
  });

  it('should call service.findOne with id', async () => {
    await controller.findOne('2');
    expect(mockService.findOne).toHaveBeenCalledWith(2);
  });

  it('should call service.update with id and dto', async () => {
    const dto = { mes: '8' };
    await controller.update('3', dto as any);
    expect(mockService.update).toHaveBeenCalledWith(3, dto);
  });

  it('should call service.remove with id', async () => {
    await controller.remove('4');
    expect(mockService.remove).toHaveBeenCalledWith(4);
  });
});
