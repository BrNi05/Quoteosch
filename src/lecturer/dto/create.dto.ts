import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateLecturerDto {
  @ApiPropertyOptional({
    description: 'The full name of the lecturer to be added/updated.',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @ApiPropertyOptional({
    description: 'The shortened, unique name of the lecturer to be added/updated.',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  shortName!: string;
}
