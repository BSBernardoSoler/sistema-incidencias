import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

describe('UsuariosController', () => {
  let controller: UsuariosController;
  let service: UsuariosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuariosController],
      providers: [
        {
          provide: UsuariosService,
          useValue: {
            findAll: jest.fn(),
            findUserByTerminoBusqueda: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsuariosController>(UsuariosController);
    service = module.get<UsuariosService>(UsuariosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call findAll with pagination', () => {
    const spy = jest.spyOn(service, 'findAll');
    controller.findAll('1', '10');
    expect(spy).toHaveBeenCalledWith(1, 10);
  });

  it('should call findUserByTerminoBusqueda with dni', () => {
    const spy = jest.spyOn(service, 'findUserByTerminoBusqueda');
    controller.findOneBydni('12345678');
    expect(spy).toHaveBeenCalledWith('12345678');
  });

  it('should call update with id and DTO', () => {
    const dto: UpdateUsuarioDto = { nombres: 'Nuevo' };
    const spy = jest.spyOn(service, 'update');
    controller.update('5', dto);
    expect(spy).toHaveBeenCalledWith(5, dto);
  });

  it('should call remove with id', () => {
    const spy = jest.spyOn(service, 'remove');
    controller.remove('8');
    expect(spy).toHaveBeenCalledWith(8);
  });
});
