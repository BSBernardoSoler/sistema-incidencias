// historial-cambios.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { HistorialCambiosController } from './historial-cambios.controller';
import { HistorialCambiosService } from './historial-cambios.service';

describe('HistorialCambiosController', () => {
  let controller: HistorialCambiosController;
  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistorialCambiosController],
      providers: [{ provide: HistorialCambiosService, useValue: mockService }],
    }).compile();

    controller = module.get<HistorialCambiosController>(HistorialCambiosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.create', async () => {
    const dto = { campo_modificado: 'x' };
    await controller.create(dto as any);
    expect(mockService.create).toHaveBeenCalledWith(dto);
  });

  it('should call service.findAll with defaults', async () => {
    await controller.findAll("", "");
    expect(mockService.findAll).toHaveBeenCalledWith(1, 10);
  });

  it('should call service.findOne with id', async () => {
    await controller.findOne('2');
    expect(mockService.findOne).toHaveBeenCalledWith(2);
  });

  it('should call service.update with id and dto', async () => {
    const dto = { campo_modificado: 'updated' };
    await controller.update('3', dto as any);
    expect(mockService.update).toHaveBeenCalledWith(3, dto);
  });

  it('should call service.remove with id', async () => {
    await controller.remove('4');
    expect(mockService.remove).toHaveBeenCalledWith(4);
  });
});
