import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FindQuoteDto {
  @ApiPropertyOptional({
    description: 'Optional filter to get quotes from a specific lecturer.',
    type: String,
    example: 'ppeti',
  })
  @IsOptional()
  @IsString()
  lecturer?: string;
}
