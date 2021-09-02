import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sport } from 'src/sports/entities/sport.entity';
import { SportsService } from 'src/sports/sports.service';
import { UsersService } from 'src/users/users.service';
import { Connection, Repository } from 'typeorm';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { Professional } from './entities/professional.entity';

@Injectable()
export class ProfessionalsService {
  constructor(
    @InjectRepository(Professional)
    private professionalsRepository: Repository<Professional>,
    private usersService: UsersService,
    private sportsService: SportsService,
    private connection: Connection,
  ) {}

  async create(createProfessionalDto: CreateProfessionalDto) {
    const { age, gender, expertise, email, name, bio } = createProfessionalDto;

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

      const professionalExpertise = new Array<Sport>();

      for (let i = 0; i < expertise.length; i++) {
        const newSport = await this.sportsService.findOne(expertise[i]);
        professionalExpertise.push(newSport);
      }

      const professional = new Professional(bio);

      professional.user = user;
      professional.expertise = [...professionalExpertise];

      return this.professionalsRepository.save(professional);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    } finally {
      await queryRunner.release();
    }
  }

  findAll() {
    return this.professionalsRepository.find();
  }

  findOne(id: number) {
    return this.findOne(id);
  }

  update(id: number, updateProfessionalDto: UpdateProfessionalDto) {
    return `This action updates a #${id} professional`;
  }

  remove(id: number) {
    return this.remove(id);
  }
}