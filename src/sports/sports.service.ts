import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSportDto } from './dto/create-sport.dto';
import { UpdateSportDto } from './dto/update-sport.dto';
import { Sport } from './entities/sport.entity';

@Injectable()
export class SportsService {
  constructor(
    @InjectRepository(Sport)
    private sportsRepository: Repository<Sport>,
  ) {}

  create(createSportDto: CreateSportDto) {
    return this.sportsRepository.save(createSportDto);
  }

  findAll() {
    return this.sportsRepository.find();
  }

  findOne(id: string) {
    return this.sportsRepository.findOne(id);
  }

  update(id: string, updateSportDto: UpdateSportDto) {
    return `This action updates a #${id} sport`;
  }

  remove(id: string) {
    return `This action removes a #${id} sport`;
  }
}
