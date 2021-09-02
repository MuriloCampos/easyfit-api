import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { email, name, gender, age } = createUserDto;

    if (!email) {
      throw new BadRequestException('E-mail is required.');
    }

    const userExists = await this.usersRepository.findOne({ email });

    if (userExists) {
      throw new BadRequestException('User already exists.');
    }

    const user = new User(email, name, age, gender);

    return this.usersRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ id });

    if (!user) {
      throw new NotFoundException('No user found with the informed id.');
    }

    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ email });

    if (!user) {
      throw new NotFoundException('No user found with the informed e-mail.');
    }

    return user;
  }

  async remove(id: string): Promise<{ deleted: boolean; message?: string }> {
    try {
      await this.usersRepository.delete({ id });
      return { deleted: true };
    } catch (err) {
      return { deleted: false, message: err.message };
    }
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update(id, updateUserDto);
  }
}
