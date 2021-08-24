import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentDto } from './create-student.dto';

export class UpdateStudentDto extends PartialType(CreateStudentDto) {
  age: number;
  weight: number;
  height: number;
  gender: 'male' | 'female' | 'not informed';
  goals: string;
  sports: string[];
}
