import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
} from '@nestjs/common';
import { ContributeQuoteService } from './contribute-quote.service';
import { CreateQuoteDto } from './dto/create.dto';
import { QuoteResponse } from './entity/response.entity';
import { ApiOperation, ApiNoContentResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

@Controller('quote/contribute')
export class ContributeQuoteController {
  constructor(private readonly contributeService: ContributeQuoteService) {}

  // GET /quote/contribute
  @ApiOperation({ summary: 'Retrieve a verbose list of all (pending) suggested quotes.' })
  @Throttle({ default: { limit: 100, ttl: 6000 } })
  @Get()
  async findAll(): Promise<QuoteResponse[]> {
    return this.contributeService.findAll();
  }

  // PATCH /quote/contribute
  @ApiOperation({
    summary:
      'CONTRIBUTION ENDPOINT - Suggest a quote to be added to the database. Only already acceopted lecturers can have quotes suggested.',
  })
  @Throttle({ default: { limit: 50, ttl: 60000 } })
  @Patch()
  async suggest(@Body() createQuoteDto: CreateQuoteDto): Promise<QuoteResponse> {
    const { quote, lecturerShortName } = createQuoteDto;
    return this.contributeService.suggestQuote(quote, lecturerShortName);
  }

  // POST /quote/contribute/:id
  @ApiOperation({ summary: 'ADMIN ENDPOINT - Accept a suggested quote.' })
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post(':id')
  async approve(@Param('id', ParseIntPipe) id: number): Promise<QuoteResponse> {
    return this.contributeService.approveQuote(id);
  }

  // DELETE /quote/contribute/:id
  @ApiOperation({ summary: 'ADMIN ENDPOINT - Decline a suggested quote.' })
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Delete(':id')
  @HttpCode(204)
  @ApiNoContentResponse({
    description: 'The suggested quote will be deleted from the pending list.',
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.contributeService.deleteQuote(id);
  }
}
