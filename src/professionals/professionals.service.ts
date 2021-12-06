import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sport } from 'src/sports/entities/sport.entity';
import { SportsService } from 'src/sports/sports.service';
import { UsersService } from 'src/users/users.service';
import { Connection, ILike, In, Like, Repository } from 'typeorm';
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

  ITEMS_PER_PAGE = 10;

  async create(createProfessionalDto: CreateProfessionalDto) {
    const { age, gender, expertise, email, name, 
      bio, avatar_url, hour_rate, working_hours } = createProfessionalDto;

    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await this.usersService.create({
        email,
        gender,
        name,
        age,
        avatar_url,
      });

      const professionalExpertise = new Array<Sport>();

      for (let i = 0; i < expertise.length; i++) {
        const newSport = await this.sportsService.findOne(expertise[i]);
        professionalExpertise.push(newSport);
      }

      const professional = new Professional(bio);

      professional.user = user;
      professional.expertise = [...professionalExpertise];
      professional.hour_rate = hour_rate
      professional.working_hours = working_hours

      return this.professionalsRepository.save(professional);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(page: number) {
    const skippedItems = (page - 1) * this.ITEMS_PER_PAGE;
    const totalCount = await this.professionalsRepository.count();
    const data = await this.professionalsRepository
      .createQueryBuilder('professional')
      .leftJoinAndSelect('professional.user', 'user')
      .leftJoinAndSelect('professional.expertise', 'expertise')
      .skip(skippedItems)
      .take(this.ITEMS_PER_PAGE)
      .getMany();

    return {
      data,
      page,
      totalCount,
    };
  }

  findOne(id: string) {
    return this.professionalsRepository.findOne(id);
  }

  async findByFilter(filters) {
    console.log(filters);
    const skippedItems = (filters.page - 1) * this.ITEMS_PER_PAGE;

    if (filters.sport && !filters.name) {
      const filteredProfessionals = await this.professionalsRepository
        .createQueryBuilder('professional')
        .leftJoin('professional.expertise', 'expertise')
        .where('expertise.id = :id', { id: filters.sport })
        .getMany();

      const ids = filteredProfessionals.map(
        (filteredProfessional) => filteredProfessional.id,
      );

      const totalCount = (
        await this.professionalsRepository.find({ where: { id: In(ids) } })
      ).length;

      const data = await this.professionalsRepository.find({
        where: { id: In(ids) },
        skip: skippedItems,
        take: this.ITEMS_PER_PAGE,
      });

      return {
        data,
        page: filters.page,
        totalCount,
      };
    } else if (!filters.sport && filters.name) {
      const totalCount = (
        await this.professionalsRepository.find({
          where: {
            user: { name: Like(`%${filters.name}%`) },
          },
          relations: ['user'],
        })
      ).length;

      const data = await this.professionalsRepository.find({
        where: {
          user: { name: ILike(`%${filters.name}%`) },
        },
        skip: skippedItems,
        take: this.ITEMS_PER_PAGE,
        relations: ['user'],
      });

      return {
        data,
        page: filters.page,
        totalCount,
      };
    }

    const filteredProfessionals = await this.professionalsRepository
      .createQueryBuilder('professional')
      .leftJoin('professional.expertise', 'expertise')
      .leftJoin('professional.user', 'user')
      .where('expertise.id = :id', { id: filters.sport })
      .andWhere('user.name ilike :name', { name: `%${filters.name}%` })
      .getMany();

    const ids = filteredProfessionals.map(
      (filteredProfessional) => filteredProfessional.id,
    );

    const totalCount = (
      await this.professionalsRepository.find({ where: { id: In(ids) } })
    ).length;

    const data = await this.professionalsRepository.find({
      where: { id: In(ids) },
      skip: skippedItems,
      take: this.ITEMS_PER_PAGE,
    });

    return {
      data,
      page: filters.page,
      totalCount,
    };
  }

  update(id: number, updateProfessionalDto: UpdateProfessionalDto) {
    return `This action updates a #${id} professional`;
  }

  remove(id: number) {
    return this.remove(id);
  }
}
