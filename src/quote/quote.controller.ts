import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpCode,
} from '@nestjs/common';
import { QuoteService } from './quote.service';
import { CreateQuoteDto } from './dto/create.dto';
import { UpdateQuoteDto } from './dto/update.dto';
import { FindQuoteDto } from './dto/find.dto';
import { QuoteResponse } from './entity/response.entity';
import { ApiOperation, ApiNoContentResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

@Controller('quote')
export class QuoteController {
  constructor(private readonly quoteService: QuoteService) {}

  // GET /quote?lecturer=kovacsj
  @ApiOperation({
    summary:
      'Retrieve a random quote. Optionally, filter by a specific lecturer using a query parameter.',
  })
  @Get()
  async findRandom(@Query() query: FindQuoteDto): Promise<string> {
    return this.quoteService.findRandom(query.lecturer);
  }

  // GET /quote/verbose?lecturer=kovacsj
  @ApiOperation({
    summary:
      'Retrieve a verbose list of all quotes. Optionally, filter by a specific lecturer using a query parameter.',
  })
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Get('verbose')
  async findVerbose(@Query() query: FindQuoteDto): Promise<QuoteResponse[]> {
    return this.quoteService.findAll(query.lecturer);
  }

  // POST /quote
  @ApiOperation({ summary: 'ADMIN ENDPOINT - Create a new quote record in the database.' })
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post()
  async create(@Body() createQuoteDto: CreateQuoteDto): Promise<QuoteResponse> {
    const { quote, lecturerShortName } = createQuoteDto;
    return this.quoteService.createQuote(quote, lecturerShortName);
  }

  // PUT /quote/:id
  @ApiOperation({ summary: "ADMIN ENDPOINT - Update an existing quote's information." })
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateQuoteDto: UpdateQuoteDto
  ): Promise<QuoteResponse> {
    return this.quoteService.updateQuote(id, updateQuoteDto);
  }

  // DELETE /quote/:id
  @ApiOperation({ summary: 'ADMIN ENDPOINT - Delete and existing quote record.' })
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Delete(':id')
  @HttpCode(204)
  @ApiNoContentResponse({
    description:
      'If the associated lecturer no longer has any quotes, they will be deleted as well.',
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.quoteService.deleteQuote(id);
  }
}
