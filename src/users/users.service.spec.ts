import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { internet, datatype } from 'faker';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

const userArray = [
  {
    id: datatype.uuid(),
    email: internet.email(),
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: datatype.uuid(),
    email: internet.email(),
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: datatype.uuid(),
    email: internet.email(),
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: datatype.uuid(),
    email: internet.email(),
    created_at: new Date(),
    updated_at: new Date(),
  },
];

const oneUser = {
  id: datatype.uuid(),
  email: internet.email(),
  created_at: new Date(),
  updated_at: new Date(),
};

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn().mockResolvedValue(userArray),
            save: jest.fn().mockResolvedValue(oneUser),
            delete: jest.fn().mockResolvedValue(true),
            findOne: jest.fn().mockResolvedValue(oneUser),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('creating a user', () => {
    it('throws an error when no e-mail is provided', async () => {
      expect.assertions(2);

      try {
        await service.create({ email: '' });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('E-mail is required.');
      }
    });

    it('successfully creates an user', async () => {
      const email = internet.email();

      const createUserDto: CreateUserDto = { email };

      const savedUserEntity = new User(email);
      savedUserEntity.id = datatype.uuid();
      savedUserEntity.created_at = new Date();
      savedUserEntity.updated_at = new Date();

      expect(service.create(createUserDto)).resolves.toEqual(oneUser);
      expect(repository.save).toBeCalledTimes(1);
      expect(repository.save).toBeCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = await service.findAll();
      expect(users).toEqual(userArray);
    });
  });

  describe('findOne', () => {
    it('should get a single user', () => {
      const id = datatype.uuid();
      const repoSpy = jest.spyOn(repository, 'findOne');
      expect(service.findOne(id)).resolves.toEqual({ ...oneUser, id });
      expect(repoSpy).toBeCalledWith({ id });
    });
  });

  describe('findOneByEmail', () => {
    it('should get one user back', () => {
      const email = internet.email();
      const repoSpy = jest.spyOn(repository, 'findOne');
      expect(service.findOneByEmail(email)).resolves.toEqual({
        ...oneUser,
        email,
      });
      expect(repoSpy).toBeCalledWith({ email });
    });
  });

  describe('remove', () => {
    it('should return { deleted: true }', () => {
      expect(service.remove('a uuid')).resolves.toEqual({ deleted: true });
    });
    it('should return { deleted: false, message: err.message }', () => {
      const repoSpy = jest
        .spyOn(repository, 'delete')
        .mockRejectedValueOnce(new Error('Bad Delete Method.'));
      expect(service.remove('a bad uuid')).resolves.toEqual({
        deleted: false,
        message: 'Bad Delete Method.',
      });
      expect(repoSpy).toBeCalledWith({ id: 'a bad uuid' });
      expect(repoSpy).toBeCalledTimes(1);
    });
  });
});
