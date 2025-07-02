import { Test, TestingModule } from '@nestjs/testing';
import { ObservacionesController } from './observaciones.controller';
import { ObservacionesService } from './observaciones.service';

describe('ObservacionesController', () => {
  let controller: ObservacionesController;
  let service: ObservacionesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ObservacionesController],
      providers: [
        {
          provide: ObservacionesService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ObservacionesController>(ObservacionesController);
    service = module.get<ObservacionesService>(ObservacionesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call create()', async () => {
    const dto = { detalle_observacion: 'Obs', registro_id: 1, usuario_reporta_id: 1 } as any;
    await controller.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should call findAll()', async () => {
    await controller.findAll('1', '10');
    expect(service.findAll).toHaveBeenCalledWith(1, 10);
  });

  it('should call findOne()', async () => {
    await controller.findOne('1');
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should call update()', async () => {
    const dto = { detalle_observacion: 'Updated' } as any;
    await controller.update('1', dto);
    expect(service.update).toHaveBeenCalledWith(1, dto);
  });

  it('should call remove()', async () => {
    await controller.remove('1');
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
