import { Inject, Injectable } from '@nestjs/common';
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

    sports.forEach(async (sport) => {
      const newSport = await this.sportsService.findOne(sport);
      userSports.push(newSport);
    });

    const student = new Student();

    student.age = age;
    student.weight = weight;
    student.height = height;
    student.gender = gender;
    student.goals = goals;
    student.user = user;
    student.sports = userSports;

    return this.studentsRepository.save(student);
  }

  findAll() {
    return this.studentsRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} student`;
  }

  update(id: number, updateStudentDto: UpdateStudentDto) {
    return `This action updates a #${id} student`;
  }

  remove(id: number) {
    return `This action removes a #${id} student`;
  }
}
