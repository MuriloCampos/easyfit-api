import { ApiProperty } from '@nestjs/swagger';
import { Length, IsIn, IsNumber } from 'class-validator';

export class CreateProfessionalDto {
  @IsNumber()
  @ApiProperty()
  age: number;

  @IsIn(['male', 'female', 'not informed'])
  @ApiProperty({ enum: ['male', 'female', 'not informed'] })
  gender: 'male' | 'female' | 'not informed';

  @ApiProperty()
  expertise: string[];

  @ApiProperty()
  @Length(5, 255)
  name: string;

  @ApiProperty()
  @Length(5, 255)
  avatar_url: string;

  @Length(5, 500)
  @ApiProperty()
  bio: string;

  @ApiProperty()
  @Length(5, 255)
  email: string;

  @ApiProperty()
  working_hours: string;

  @ApiProperty()
  hour_rate: number;
}
