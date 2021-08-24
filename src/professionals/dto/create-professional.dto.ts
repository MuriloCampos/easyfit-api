export class CreateProfessionalDto {
  age: number;
  gender: 'male' | 'female' | 'not informed';
  expertise: string[];
  name: string;
  bio: string;
  email: string;
}
