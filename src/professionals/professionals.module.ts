import { Module } from '@nestjs/common';
import { ProfessionalsService } from './professionals.service';
import { ProfessionalsController } from './professionals.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Professional } from './entities/professional.entity';
import { UsersModule } from 'src/users/users.module';
import { SportsModule } from 'src/sports/sports.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Professional]),
    UsersModule,
    SportsModule,
  ],
  controllers: [ProfessionalsController],
  providers: [ProfessionalsService],
})
export class ProfessionalsModule {}
