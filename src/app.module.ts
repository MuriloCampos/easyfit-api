import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { StudentsModule } from './students/students.module';
import { SportsModule } from './sports/sports.module';
import { ProfessionalsModule } from './professionals/professionals.module';

@Module({
  imports: [TypeOrmModule.forRoot(), UsersModule, StudentsModule, SportsModule, ProfessionalsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
