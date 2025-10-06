import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
} from '@nestjs/common';
import { ContributeLecturerService } from './contribute-lecturer.service';
import { CreateLecturerDto } from './dto/create.dto';
import { LecturerResponse } from './entity/response.entity';
import { ApiOperation, ApiNoContentResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

@Controller('lecturer/contribute')
export class ContributeLecturerController {
  constructor(private readonly contributeService: ContributeLecturerService) {}

  // GET /lecturer/contribute
  @ApiOperation({ summary: 'Retrieve a verbose list of all (pending) suggested lecturers.' })
  @Throttle({ default: { limit: 100, ttl: 6000 } })
  @Get()
  async findAll(): Promise<LecturerResponse[]> {
    return this.contributeService.findAll();
  }

  // PATCH /lecturer/contribute
  @ApiOperation({
    summary: 'CONTRIBUTION ENDPOINT - Suggest a lecturer to be added to the database.',
  })
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @Patch()
  async suggest(@Body() createDto: CreateLecturerDto): Promise<LecturerResponse> {
    return this.contributeService.suggest(createDto);
  }

  // POST /lecturer/contribute/:id
  @ApiOperation({ summary: 'ADMIN ENDPOINT - Accept a suggested lecturer.' })
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post(':id')
  async approve(@Param('id', ParseIntPipe) id: number): Promise<LecturerResponse> {
    return this.contributeService.approve(id);
  }

  // DELETE /lecturer/contribute/:id
  @ApiOperation({ summary: 'ADMIN ENDPOINT - Decline a suggested lecturer.' })
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Delete(':id')
  @HttpCode(204)
  @ApiNoContentResponse({
    description: 'The suggested lecturer will be deleted from the pending list.',
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.contributeService.remove(id);
  }
}
