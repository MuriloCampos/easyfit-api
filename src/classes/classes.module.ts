import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';
import { Class } from './entities/class.entity';
import { SportsModule } from 'src/sports/sports.module';
import { ProfessionalsModule } from 'src/professionals/professionals.module';
import { StudentsModule } from 'src/students/students.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Class]),
    SportsModule,
    ProfessionalsModule,
    StudentsModule,
  ],
  controllers: [ClassesController],
  providers: [ClassesService]
})
export class ClassesModule {}
