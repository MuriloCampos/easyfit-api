import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { SportsModule } from './sports/sports.module';

@Module({
  imports: [TypeOrmModule.forRoot(), UsersModule, SportsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
