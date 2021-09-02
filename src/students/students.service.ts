import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { Sport } from 'src/sports/entities/sport.entity';
import { SportsService } from 'src/sports/sports.service';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
    private usersService: UsersService,
    private sportsService: SportsService,
    private connection: Connection,
  ) {}

  async create(createStudentDto: CreateStudentDto) {
    const { age, weight, height, gender, goals, sports, email, name } =
      createStudentDto;

    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await this.usersService.create({
        email,
        gender,
        name,
        age,
      });

      const userSports = new Array<Sport>();

      for (let i = 0; i < sports.length; i++) {
        const newSport = await this.sportsService.findOne(sports[i]);
        userSports.push(newSport);
      }

      const student = new Student(weight, height, goals);

      student.user = user;
      student.sports = [...userSports];

      return this.studentsRepository.save(student);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    } finally {
      await queryRunner.release();
    }
  }

  findAll() {
    return this.studentsRepository.find();
  }

  findOne(id: string) {
    return this.studentsRepository.findOne(id);
  }

  async findOneByEmail(email: string) {
    const user = await this.usersService.findOneByEmail(email);
    return this.studentsRepository.findOne({ user: user });
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    const { age, weight, height, gender, goals, sports } = updateStudentDto;
    let student = await this.studentsRepository.findOne(id);

    if (!student) {
      throw new NotFoundException('No student found with the informed id.');
    }

    const userSports = new Array<Sport>();

    for (let i = 0; i < sports.length; i++) {
      const newSport = await this.sportsService.findOne(sports[i]);
      userSports.push(newSport);
    }

    await this.usersService.update(student.user.id, {
      gender,
      age,
    });

    student = {
      ...student,
      weight,
      height,
      goals,
      sports: [...userSports],
    };

    return this.studentsRepository.save(student);
  }

  async remove(id: string) {
    const student = await this.findOne(id);

    if (!student) {
      throw new NotFoundException('Student not found.');
    }
    const userToRemove = student.user;
    await this.studentsRepository.remove(student);
    await this.usersService.remove(userToRemove.id);

    return { deleted: true };
  }
}
