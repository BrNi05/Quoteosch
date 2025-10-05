import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateQuoteDto {
  @ApiPropertyOptional({
    description: 'The quote to be added/updated.',
    example: 'I think, therefore I am.',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  quote!: string;

  @ApiPropertyOptional({
    description: 'The shortened, unique name of the lecturer who said the quote/updated.',
    example: 'ppeti',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  lecturerShortName!: string;
}
