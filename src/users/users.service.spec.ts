import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { internet, datatype, name } from 'faker';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

const userArray = [
  {
    id: datatype.uuid(),
    email: internet.email(),
    name: name.firstName(),
    gender: 'not informed',
    age: datatype.number(),
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: datatype.uuid(),
    email: internet.email(),
    name: name.firstName(),
    gender: 'not informed',
    age: datatype.number(),
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: datatype.uuid(),
    email: internet.email(),
    name: name.firstName(),
    gender: 'not informed',
    age: datatype.number(),
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: datatype.uuid(),
    email: internet.email(),
    name: name.firstName(),
    gender: 'not informed',
    age: datatype.number(),
    created_at: new Date(),
    updated_at: new Date(),
  },
];

const oneUser = {
  id: datatype.uuid(),
  email: internet.email(),
  name: name.firstName(),
  gender: 'not informed',
  age: datatype.number(),
  created_at: new Date(),
  updated_at: new Date(),
};

const mockedRepo = {
  save: jest.fn(() => Promise.resolve(oneUser)),
  find: jest.fn(() => Promise.resolve(userArray)),
  delete: jest.fn(() => Promise.resolve(true)),
  findOne: jest.fn(() => Promise.resolve(oneUser)),
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
          useValue: mockedRepo,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should throw an error when no e-mail is provided', async () => {
      try {
        await service.create({
          email: '',
          gender: 'not informed',
          age: datatype.number(),
          name: name.firstName(),
        });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('E-mail is required.');
      }
    });

    it('should successfully create a user', async () => {
      const email = internet.email();

      const createUserDto: CreateUserDto = {
        email,
        name: name.firstName(),
        gender: 'not informed',
        age: datatype.number(),
      };

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      const result = await service.create(createUserDto);

      expect(result).toEqual(oneUser);
      expect(repository.save).toBeCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = await service.findAll();
      expect(users).toEqual(userArray);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should throw an error when user is not found', async () => {
      const id = datatype.uuid();
      const repoSpy = jest
        .spyOn(repository, 'findOne')
        .mockResolvedValueOnce(null);

      try {
        await service.findOne(id);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('No user found with the informed id.');
        expect(repoSpy).toBeCalledWith({ id });
      }
    });
    it('should get a single user', () => {
      const id = datatype.uuid();
      const repoSpy = jest.spyOn(repository, 'findOne');
      expect(service.findOne(id)).resolves.toEqual(oneUser);
      expect(repoSpy).toBeCalledWith({ id });
    });
  });

  describe('findOneByEmail', () => {
    it('should throw an error when user is not found', async () => {
      const email = internet.email();
      const repoSpy = jest
        .spyOn(repository, 'findOne')
        .mockResolvedValueOnce(null);

      try {
        await service.findOneByEmail(email);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('No user found with the informed e-mail.');
        expect(repoSpy).toBeCalledWith({ email });
      }
    });

    it('should get one user back', () => {
      const email = internet.email();
      const repoSpy = jest.spyOn(repository, 'findOne');
      expect(service.findOneByEmail(email)).resolves.toEqual(oneUser);
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
    });
  });
});
