import { Length, IsIn, IsNumber } from 'class-validator';

export class CreateStudentDto {
  @IsNumber()
  age: number;

  @IsNumber()
  weight: number;

  @IsNumber()
  height: number;

  @IsIn(['male', 'female', 'not informed'])
  gender: 'male' | 'female' | 'not informed';

  @Length(5, 500)
  goals: string;

  sports: string[];

  @Length(5, 255)
  name: string;

  email: string;
}
