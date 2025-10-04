import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContributeLecturer } from './entity/contribute-lecturer.entity';
import { Lecturer } from './entity/lecturer.entity';
import { LecturerResponse } from './entity/response.entity';
import { CreateLecturerDto } from './dto/create.dto';
import { Serializer } from 'src/utils/entity.serializer';

@Injectable()
export class ContributeLecturerService {
  constructor(
    @InjectRepository(ContributeLecturer)
    private readonly stagingRepo: Repository<ContributeLecturer>,
    @InjectRepository(Lecturer)
    private readonly lecturerRepo: Repository<Lecturer>
  ) {}

  async findAll(): Promise<LecturerResponse[]> {
    const found = await this.stagingRepo.find({ order: { lastModifiedAt: 'ASC' } });
    return Serializer.response(found);
  }

  async suggest(createDto: CreateLecturerDto): Promise<LecturerResponse> {
    const { fullName, shortName } = createDto;

    const existsMain = await this.lecturerRepo.findOne({ where: { shortName } });
    if (existsMain) throw new BadRequestException('Lecturer with this shortname already exists.');

    const existsStaging = await this.stagingRepo.findOne({ where: { shortName } });
    if (existsStaging) {
      throw new BadRequestException('Lecturer with this shortname is already suggested.');
    }

    const suggested = this.stagingRepo.create({ shortName, fullName });
    const saved = await this.stagingRepo.save(suggested);
    return Serializer.response(saved);
  }

  async approve(id: number): Promise<LecturerResponse> {
    const suggested = await this.stagingRepo.findOne({ where: { id } });
    if (!suggested) throw new NotFoundException(`Suggested lecturer with ID ${id} not found.`);

    const lecturer = this.lecturerRepo.create({
      shortName: suggested.shortName,
      fullName: suggested.fullName,
    });

    await this.stagingRepo.remove(suggested);
    const saved = await this.lecturerRepo.save(lecturer);
    return Serializer.response(saved);
  }

  async remove(id: number): Promise<void> {
    const suggested = await this.stagingRepo.findOne({ where: { id } });
    if (!suggested) throw new NotFoundException(`Suggested lecturer with ID ${id} not found.`);
    await this.stagingRepo.remove(suggested);
  }
}
