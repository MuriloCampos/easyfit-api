import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Professional } from 'src/professionals/entities/professional.entity';
import { Sport } from 'src/sports/entities/sport.entity';
import { Student } from 'src/students/entities/student.entity';
import { User } from 'src/users/entities/user.entity';
import { Class } from 'src/classes/entities/class.entity';

export default registerAs(
  'orm.config.prod',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    entities: [Professional, Sport, Student, User, Class],
    synchronize: true,
    url: process.env.DATABASE_URL,
    extra: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  }),
);
