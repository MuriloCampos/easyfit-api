import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  email: string;

  @Column()
  gender: 'male' | 'female' | 'not informed';

  @Column()
  age: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @CreateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  constructor(
    email?: string,
    name?: string,
    age?: number,
    gender?: 'male' | 'female' | 'not informed',
  ) {
    this.email = email || '';
    this.name = name || '';
    this.gender = gender || 'not informed';
    this.age = age || 0;
  }
}
