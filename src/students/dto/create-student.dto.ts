export class CreateStudentDto {
  age: number;
  weight: number;
  height: number;
  gender: 'male' | 'female' | 'not informed';
  goals: string;
  sports: string[];
  email: string;
}
