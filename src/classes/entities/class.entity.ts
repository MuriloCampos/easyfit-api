import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

import { Sport } from 'src/sports/entities/sport.entity';
import { Student } from 'src/students/entities/student.entity';
import { Professional } from 'src/professionals/entities/professional.entity';

@Entity()
export class Class {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Student, { eager: true })
  @JoinColumn()
  student: Student;

  @ManyToOne(() => Professional, { eager: true })
  @JoinColumn()
  professional: Professional;

  @ManyToOne(() => Sport, { eager: true })
  @JoinColumn()
  sport: Sport;

  @Column()
  datetime: Date;

  @Column()
  rating?: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @CreateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  constructor(
    student?: Student,
    professional?: Professional,
    sport?: Sport,
    datetime?: string,
    rating?: number,
  ) {
    this.student = student;
    this.professional = professional;
    this.sport = sport;
    this.datetime = new Date(datetime);
    this.rating = rating;
  }
}
