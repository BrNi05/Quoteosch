import { ApiProperty } from '@nestjs/swagger';

export class QuoteResponse {
  @ApiProperty({ description: 'A unique, auto-generated identifier for all records.' })
  id!: number;

  @ApiProperty({ description: 'A quote text itself.', example: 'I think, therefore I am.' })
  content!: string;

  @ApiProperty({
    description: "The lecturer's shortened name associated with this quote.",
    example: 'ppeti',
  })
  lecturer!: string;

  @ApiProperty({ description: 'Timestamp of the last modification.' })
  lastModifiedAt!: Date;
}
