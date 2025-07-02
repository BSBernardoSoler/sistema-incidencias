import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosService } from './usuarios.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/usuario.entity';
import { Repository } from 'typeorm';

describe('UsuariosService', () => {
  let service: UsuariosService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuariosService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsuariosService>(UsuariosService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const user = { id: 1, nombres: 'Juan' } as User;
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(user);
      const result = await service.findOne(1);
      expect(result).toEqual(user);
    });
  });

  describe('remove', () => {
    it('should mark a user as deleted', async () => {
      const user = { id: 1, estado: 1 } as User;
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(user);
      jest.spyOn(userRepository, 'save').mockResolvedValueOnce({ ...user, estado: 0 });

      const result = await service.remove(1);
      expect(result.estado).toBe(0);
    });
  });
});
