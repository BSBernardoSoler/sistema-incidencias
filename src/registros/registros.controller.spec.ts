import { Test, TestingModule } from '@nestjs/testing';
import { RegistrosController } from './registros.controller';
import { RegistrosService } from './registros.service';
import { CreateRegistroDto } from './dto/create-registro.dto';
import { UpdateRegistroDto } from './dto/update-registro.dto';

describe('RegistrosController', () => {
  let controller: RegistrosController;
  let service: RegistrosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegistrosController],
      providers: [
        {
          provide: RegistrosService,
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

    controller = module.get<RegistrosController>(RegistrosController);
    service = module.get<RegistrosService>(RegistrosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call create method with dto', async () => {
    const dto: CreateRegistroDto = { usuario_id: 1, lote: 'L123' } as any;
    await controller.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should call findAll with pagination', async () => {
    await controller.findAll('1', '10');
    expect(service.findAll).toHaveBeenCalledWith(1, 10);
  });

  it('should call findOne with id', async () => {
    await controller.findOne('5');
    expect(service.findOne).toHaveBeenCalledWith(5);
  });

  it('should call update with id and dto', async () => {
    const dto: UpdateRegistroDto = { lote: 'Updated' } as any;
    await controller.update('3', dto);
    expect(service.update).toHaveBeenCalledWith(3, dto);
  });

  it('should call remove with id', async () => {
    await controller.remove('4');
    expect(service.remove).toHaveBeenCalledWith(4);
  });
});
