import { Sport } from 'src/sports/entities/sport.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  weight: number;

  @Column()
  height: number;

  @Column()
  goals: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @CreateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @OneToOne(() => User, {
    eager: true,
  })
  @JoinColumn()
  user: User;

  @ManyToMany(() => Sport, {
    eager: true,
  })
  @JoinTable()
  sports: Sport[];

  constructor(weight?: number, height?: number, goals?: string) {
    this.weight = weight || 0;
    this.height = height || 0;
    this.goals = goals || '';
  }
}
