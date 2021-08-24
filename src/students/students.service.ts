import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  ) {}

  async create(createStudentDto: CreateStudentDto) {
    const { age, weight, height, gender, goals, sports, email } =
      createStudentDto;

    const user = await this.usersService.create({
      email,
    });

    const userSports = new Array<Sport>();

    for (let i = 0; i < sports.length; i++) {
      const newSport = await this.sportsService.findOne(sports[i]);
      userSports.push(newSport);
    }

    const student = new Student();

    student.age = age;
    student.weight = weight;
    student.height = height;
    student.gender = gender;
    student.goals = goals;
    student.user = user;
    student.sports = [...userSports];

    return this.studentsRepository.save(student);
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
    const student = await this.studentsRepository.findOne(id);

    if (!student) {
      throw new NotFoundException('No student found with the informed id.');
    }

    const userSports = new Array<Sport>();

    for (let i = 0; i < sports.length; i++) {
      const newSport = await this.sportsService.findOne(sports[i]);
      userSports.push(newSport);
    }

    student.age = age;
    student.weight = weight;
    student.height = height;
    student.gender = gender;
    student.goals = goals;
    student.sports = [...userSports];

    return this.studentsRepository.save(student);
  }

  async remove(id: string) {
    const student = await this.findOne(id);
    const userToRemove = student.user;
    await this.studentsRepository.remove(student);
    await this.usersService.remove(userToRemove.id);

    return { deleted: true };
  }
}
