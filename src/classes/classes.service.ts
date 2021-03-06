import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, ILike, In, Like, Repository, Between } from 'typeorm';
import { startOfDay, endOfDay } from 'date-fns'

import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { Class } from './entities/class.entity';
import { SportsService } from 'src/sports/sports.service';
import { ProfessionalsService } from 'src/professionals/professionals.service';
import { StudentsService } from 'src/students/students.service';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class)
    private classesRepository: Repository<Class>,
    private sportsService: SportsService,
    private professionalsService: ProfessionalsService,
    private studentsService: StudentsService,
  ) {}

  async create(createClassDto: CreateClassDto) {
    const { professional_id, sport_id, student_email, class_datetime } = createClassDto;
    const professional = await this.professionalsService.findOne(professional_id)
    const sport = await this.sportsService.findOne(sport_id)
    const student = await this.studentsService.findOneByEmail(student_email)

    const newClass = new Class(student, professional, sport, class_datetime, -1)
    return this.classesRepository.save(newClass);
  }

  findAll() {
    return `This action returns all classes`;
  }

  async updateClassRating(classId: string, newRating: number) {
    const currentClass = await this.classesRepository.findOne({ id: classId })

    currentClass.rating = newRating

    return this.classesRepository.save(currentClass)
  }

  async getProfessionalAverageRating(professional_id: string) {
    const professional = await this.professionalsService.findOne(professional_id)
    const allClasses = await this.classesRepository.find({ professional })
    let totalValidRating = 0
    let totalRatedClasses = 0

    allClasses.forEach(classItem => {
      if (classItem.rating > 0) {
        totalRatedClasses += 1
        totalValidRating += classItem.rating
      }
    })

    return totalRatedClasses > 0 ? totalValidRating / totalRatedClasses : -1
  }

  async findStudentClassesByEmail(email: string) {
    const student = await this.studentsService.findOneByEmail(email)
    
    return this.classesRepository.find({ student })
  }

  async findProfessionalClasses(professional_id: string) {
    const professional = await this.professionalsService.findOne(professional_id)

    return this.classesRepository.find({ professional })
  }

  async findProfessionalClassesByDay(professional_id: string, day: Date) {
    const professional = await this.professionalsService.findOne(professional_id)

    const isSameDay = (date: Date) => Between(startOfDay(date), endOfDay(date))

    return this.classesRepository.find({
      where: {
        professional,
        datetime: isSameDay(day)
      },
      order: {
        datetime: 'DESC'
      },
    })
  }

  findOne(id: number) {
    return this.classesRepository.findOne(id);
  }

  update(id: number, updateClassDto: UpdateClassDto) {
    return `This action updates a #${id} class`;
  }

  remove(id: number) {
    return `This action removes a #${id} class`;
  }
}
