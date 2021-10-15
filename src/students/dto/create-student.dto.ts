import { Length, IsIn, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStudentDto {
  @IsNumber()
  @ApiProperty()
  age: number;

  @IsNumber()
  @ApiProperty()
  weight: number;

  @IsNumber()
  @ApiProperty()
  height: number;

  @IsIn(['male', 'female', 'not informed'])
  @ApiProperty({ enum: ['male', 'female', 'not informed'] })
  gender: 'male' | 'female' | 'not informed';

  @Length(5, 500)
  @ApiProperty()
  goals: string;

  @ApiProperty()
  @Length(5, 255)
  avatar_url: string;

  @ApiProperty()
  sports: string[];

  @ApiProperty()
  @Length(5, 255)
  name: string;

  @ApiProperty()
  @Length(5, 255)
  email: string;
}
