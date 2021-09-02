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
export class Professional {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  bio: string;

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
  expertise: Sport[];

  constructor(bio?: string) {
    this.bio = bio || '';
  }
}
