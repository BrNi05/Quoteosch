import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContributeQuote } from './entity/contribute-quote.entity';
import { Quote } from './entity/quote.entity';
import { Lecturer } from '../lecturer/entity/lecturer.entity';
import { QuoteResponse } from './entity/response.entity';
import { Serializer } from '../utils/entity.serializer';

@Injectable()
export class ContributeQuoteService {
  constructor(
    @InjectRepository(ContributeQuote)
    private readonly stagingRepo: Repository<ContributeQuote>,
    @InjectRepository(Quote)
    private readonly quoteRepo: Repository<Quote>,
    @InjectRepository(Lecturer)
    private readonly lecturerRepo: Repository<Lecturer>
  ) {}

  // GET /quote/contribute
  async findAll(): Promise<QuoteResponse[]> {
    const found = await this.stagingRepo.find({
      relations: ['lecturer'],
      order: { lastModifiedAt: 'ASC' },
    });

    return Serializer.response(found);
  }

  // PATCH /quote/contribute
  async suggestQuote(content: string, lecturerShortname: string): Promise<QuoteResponse> {
    const lecturer = await this.lecturerRepo.findOne({
      where: { shortName: lecturerShortname },
    });

    if (!lecturer) {
      throw new BadRequestException(
        `Lecturer with shortname ${lecturerShortname} not found. Suggest to add it or wait for the pending suggestion to be approved.`
      );
    }

    const contributed = this.stagingRepo.create({ content, lecturer });

    const saved = await this.stagingRepo.save(contributed);
    return Serializer.response(saved);
  }

  // POST /quote/contribute/:id
  async approveQuote(id: number): Promise<QuoteResponse> {
    const contributed = await this.stagingRepo.findOne({
      where: { id },
      relations: ['lecturer'],
    });

    if (!contributed) throw new NotFoundException(`Contributed quote with ID ${id} not found.`);

    const quote = this.quoteRepo.create({
      content: contributed.content,
      lecturer: contributed.lecturer,
    });

    await this.stagingRepo.remove(contributed);
    const saved = await this.quoteRepo.save(quote);
    return Serializer.response(saved);
  }

  // DELETE /quote/contribute/:id
  async deleteQuote(id: number): Promise<void> {
    const contributed = await this.stagingRepo.findOne({ where: { id } });

    if (!contributed) throw new NotFoundException(`Contributed quote with ID ${id} not found.`);

    await this.stagingRepo.remove(contributed);
  }
}
