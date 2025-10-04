import { PartialType } from '@nestjs/swagger';
import { CreateQuoteDto } from './create.dto';

export class UpdateQuoteDto extends PartialType(CreateQuoteDto) {}
