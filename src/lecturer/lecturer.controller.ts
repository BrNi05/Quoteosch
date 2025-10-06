import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
} from '@nestjs/common';
import { LecturerService } from './lecturer.service';
import { CreateLecturerDto } from './dto/create.dto';
import { UpdateLecturerDto } from './dto/update.dto';
import { LecturerResponse } from './entity/response.entity';
import { ApiOperation, ApiNoContentResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

@Controller('lecturer')
export class LecturerController {
  constructor(private readonly lecturerService: LecturerService) {}

  // GET /lecturer
  @ApiOperation({ summary: 'Returns a verbose list of all lecturers.' })
  @Throttle({ default: { limit: 50, ttl: 6000 } })
  @Get()
  async findAll(): Promise<LecturerResponse[]> {
    return this.lecturerService.findAll();
  }

  // POST /lecturer
  @ApiOperation({ summary: 'ADMIN ENDPOINT - Create a new lecturer record in the database.' })
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post()
  async create(@Body() createDto: CreateLecturerDto): Promise<LecturerResponse> {
    return this.lecturerService.create(createDto);
  }

  // PUT /lecturer/:id
  @ApiOperation({ summary: "ADMIN ENDPOINT - Update an existing lecturer's information." })
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateLecturerDto
  ): Promise<LecturerResponse> {
    return this.lecturerService.update(id, updateDto);
  }

  // DELETE /lecturer/:id
  @ApiOperation({
    summary: 'ADMIN ENDPOINT - Delete a lecturer record.',
  })
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Delete(':id')
  @HttpCode(204)
  @ApiNoContentResponse({
    description: 'The lecturer will only be deleted if they have no associated quotes.',
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.lecturerService.remove(id);
  }
}
