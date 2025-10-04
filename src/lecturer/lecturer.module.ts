import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lecturer } from './entity/lecturer.entity';
import { LecturerService } from './lecturer.service';
import { LecturerController } from './lecturer.controller';
import { ContributeLecturer } from './entity/contribute-lecturer.entity';
import { ContributeLecturerController } from './contribute-lecturer.controller';
import { ContributeLecturerService } from './contribute-lecturer.service';
import { Quote } from '../quote/entity/quote.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lecturer, ContributeLecturer, Quote])],
  providers: [LecturerService, ContributeLecturerService],
  controllers: [LecturerController, ContributeLecturerController],
})
export class LecturerModule {}
