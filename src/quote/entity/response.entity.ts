import { ApiProperty } from '@nestjs/swagger';

export class QuoteResponse {
  @ApiProperty({ description: 'A unique, auto-generated identifier for all records.' })
  id!: number;

  @ApiProperty({ description: 'A quote text itself.' })
  content!: string;

  @ApiProperty({ description: "The lecturer's shortened name associated with this quote." })
  lecturer!: string;

  @ApiProperty({ description: 'Timestamp of the last modification.' })
  lastModifiedAt!: Date;
}
