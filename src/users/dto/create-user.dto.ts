export class CreateUserDto {
  email: string;
  gender: 'male' | 'female' | 'not informed';
  name: string;
  age: number;
}
