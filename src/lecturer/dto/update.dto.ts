import { PartialType } from '@nestjs/swagger';
import { CreateLecturerDto } from './create.dto';

export class UpdateLecturerDto extends PartialType(CreateLecturerDto) {}
