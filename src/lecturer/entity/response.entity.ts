import { ApiProperty } from '@nestjs/swagger';

export class LecturerResponse {
  @ApiProperty({ description: 'A unique, auto-generated identifier for all records.' })
  id!: number;

  @ApiProperty({ description: 'The shortened, unique name of the lecturer.', example: 'ppeti' })
  shortName!: string;

  @ApiProperty({ description: 'The full name of the lecturer.', example: 'Példa Péter' })
  fullName!: string;

  @ApiProperty({ description: 'Timestamp of the last modification.' })
  lastModifiedAt!: Date;
}
