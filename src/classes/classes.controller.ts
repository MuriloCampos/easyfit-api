import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  create(@Body() createClassDto: CreateClassDto) {
    return this.classesService.create(createClassDto);
  }

  @Get()
  findAll() {
    return this.classesService.findAll();
  }

  @Get('/student_classes')
  findStudentClassesByEmail(@Query('email') email: string) {
    return this.classesService.findStudentClassesByEmail(email)
  }

  @Get('/professional_rating')
  getProfessionalRating(@Query('id', ParseUUIDPipe) id: string) {
    return this.classesService.getProfessionalAverageRating(id)
  }

  @Get('/professional_classes')
  findProfessionalClasses(@Query('id', ParseUUIDPipe) id: string, @Query('day') day: string) {
    if (day) {
      return this.classesService.findProfessionalClassesByDay(id, new Date(day))
    } else {
      return this.classesService.findProfessionalClasses(id)
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classesService.findOne(+id);
  }

  @Patch(':id')
  updateRating(@Param('id') id: string, @Query('rating') rating: number) {
    return this.classesService.updateClassRating(id, rating);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classesService.remove(+id);
  }
}
