import { ApiProperty } from '@nestjs/swagger';
import { Length, IsIn, IsNumber } from 'class-validator';

export class CreateClassDto {
  @ApiProperty()
  professional_id: string;

  @ApiProperty()
  student_email: string;

  @ApiProperty()
  sport_id: string;

  @ApiProperty()
  class_datetime: string;
}
