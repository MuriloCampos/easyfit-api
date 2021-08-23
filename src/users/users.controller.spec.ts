import { Test, TestingModule } from '@nestjs/testing';
import { internet, datatype } from 'faker';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersController } from './users.controller';
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

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            remove: jest.fn().mockResolvedValue({ deleted: true }),
            findAll: jest.fn().mockResolvedValue(userArray),
            findOne: jest.fn().mockImplementation((id: string) =>
              Promise.resolve({
                ...oneUser,
                id,
              }),
            ),
            findOneByEmail: jest.fn().mockImplementation((email: string) =>
              Promise.resolve({
                ...oneUser,
                email,
              }),
            ),
            create: jest
              .fn()
              .mockImplementation((user: CreateUserDto) =>
                Promise.resolve({ ...oneUser, email: user.email }),
              ),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUsers', () => {
    it('should get an array of users', async () => {
      await expect(controller.findAll()).resolves.toEqual(userArray);
    });
  });

  describe('getById', () => {
    it('gets a single user', async () => {
      const id = datatype.uuid();
      await expect(controller.findOne(id)).resolves.toEqual({ ...oneUser, id });
    });
  });

  describe('getByEmail', () => {
    it('should get a user back', async () => {
      const email = internet.email();

      const getByEmailSpy = jest
        .spyOn(service, 'findOneByEmail')
        .mockResolvedValueOnce({ ...oneUser, email });

      await expect(controller.findOneByEmail(email)).resolves.toEqual({
        ...oneUser,
        email,
      });

      await expect(getByEmailSpy).toBeCalledWith(email);
    });
  });

  describe('newUser', () => {
    it('should create a new user', async () => {
      const email = internet.email();
      const newUserDto: CreateUserDto = {
        email,
      };
      await expect(controller.create(newUserDto)).resolves.toEqual({
        ...oneUser,
        email,
      });
    });
  });

  describe('deleteUser', () => {
    it('should return that it deleted a user', async () => {
      await expect(controller.remove('a uuid that exists')).resolves.toEqual({
        deleted: true,
      });
    });

    it('should return that it did not delete a user', async () => {
      const deleteSpy = jest
        .spyOn(service, 'remove')
        .mockResolvedValueOnce({ deleted: false, message: 'Error' });
      await expect(
        controller.remove('a uuid that does not exist'),
      ).resolves.toEqual({ deleted: false, message: 'Error' });
      expect(deleteSpy).toBeCalledWith('a uuid that does not exist');
    });
  });
});
