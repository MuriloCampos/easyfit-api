import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { UsersModule } from 'src/users/users.module';
import { Student } from './entities/student.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SportsModule } from 'src/sports/sports.module';

@Module({
  imports: [TypeOrmModule.forFeature([Student]), UsersModule, SportsModule],
  controllers: [StudentsController],
  providers: [StudentsService],
})
export class StudentsModule {}
