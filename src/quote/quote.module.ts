import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lecturer } from '../lecturer/entity/lecturer.entity';
import { Quote } from './entity/quote.entity';
import { QuoteService } from './quote.service';
import { QuoteController } from './quote.controller';
import { ContributeQuoteService } from './contribute-quote.service';
import { ContributeQuoteController } from './contribute-quote.controller';
import { ContributeQuote } from './entity/contribute-quote.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Quote, Lecturer, ContributeQuote])],
  providers: [QuoteService, ContributeQuoteService],
  controllers: [QuoteController, ContributeQuoteController],
})
export class QuoteModule {}
