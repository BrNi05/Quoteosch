import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lecturer } from './entity/lecturer.entity';
import { LecturerResponse } from './entity/response.entity';
import { CreateLecturerDto } from './dto/create.dto';
import { UpdateLecturerDto } from './dto/update.dto';
import { Serializer } from 'src/utils/entity.serializer';

@Injectable()
export class LecturerService {
  constructor(
    @InjectRepository(Lecturer)
    private readonly lecturerRepo: Repository<Lecturer>
  ) {}

  // GET /lecturer
  async findAll(): Promise<LecturerResponse[]> {
    const found = await this.lecturerRepo.find({ order: { shortName: 'ASC' } });
    return Serializer.response(found);
  }

  // POST /lecturer
  async create(createDto: CreateLecturerDto): Promise<LecturerResponse> {
    const exists = await this.lecturerRepo.findOne({ where: { shortName: createDto.shortName } });
    if (exists) throw new BadRequestException('Lecturer with this shortname already exists.');

    const lecturer = this.lecturerRepo.create(createDto);
    const saved = await this.lecturerRepo.save(lecturer);
    return Serializer.response(saved);
  }

  // PUT /lecturer/:id
  async update(id: number, updateDto: UpdateLecturerDto): Promise<LecturerResponse> {
    const lecturer = await this.lecturerRepo.findOne({ where: { id } });
    if (!lecturer) throw new NotFoundException(`Lecturer with ID ${id} not found.`);

    Object.assign(lecturer, updateDto);
    const saved = await this.lecturerRepo.save(lecturer);
    return Serializer.response(saved);
  }

  // DELETE /lecturer/:id
  async remove(id: number): Promise<void> {
    const lecturer = await this.lecturerRepo.findOne({ where: { id }, relations: ['quotes'] });
    if (!lecturer) throw new NotFoundException(`Lecturer with ID ${id} not found.`);

    if (lecturer.quotes.length > 0) {
      throw new BadRequestException('Cannot delete lecturer with associated quotes.');
    }

    await this.lecturerRepo.remove(lecturer);
  }
}
