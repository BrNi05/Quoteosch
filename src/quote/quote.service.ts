import {
  BadRequestException,
  NotFoundException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Quote } from './entity/quote.entity';
import { QuoteResponse } from './entity/response.entity';
import { UpdateQuoteDto } from './dto/update.dto';
import { Lecturer } from '../lecturer/entity/lecturer.entity';
import { Serializer } from '../utils/entity.serializer';

@Injectable()
export class QuoteService {
  constructor(
    @InjectRepository(Quote)
    private readonly quoteRepo: Repository<Quote>,
    @InjectRepository(Lecturer)
    private readonly lecturerRepo: Repository<Lecturer>
  ) {}

  // GET /quote?lecturer=shortName
  async findRandom(lecturerShortName?: string): Promise<QuoteResponse> {
    const count = await this.quoteRepo.count();
    if (count === 0) throw new InternalServerErrorException('Failed to retrieve a random quote');

    const query = this.quoteRepo
      .createQueryBuilder('quote')
      .leftJoinAndSelect('quote.lecturer', 'lecturer')
      .select(['quote.id', 'quote.content', 'quote.lastModifiedAt', 'lecturer.shortName']);

    if (lecturerShortName) {
      query.where('lecturer.shortName = :shortName', { shortName: lecturerShortName });
    }

    query.orderBy('RANDOM()').take(1);

    const randomQuote = await query.getOne();
    if (!randomQuote) throw new BadRequestException('No quotes found for the specified lecturer');

    return Serializer.response(randomQuote);
  }

  // GET /quote/verbose?lecturer=shortName
  async findAll(lecturerShortname?: string): Promise<QuoteResponse[]> {
    const where: FindOptionsWhere<Quote> = lecturerShortname
      ? { lecturer: { shortName: lecturerShortname } }
      : {};

    const found = await this.quoteRepo.find({
      where,
      relations: ['lecturer'],
      order: { lastModifiedAt: 'DESC' },
    });

    return Serializer.response(found);
  }

  // POST /quote
  async createQuote(content: string, lecturerShortname: string): Promise<QuoteResponse> {
    const lecturer = await this.lecturerRepo.findOne({
      where: { shortName: lecturerShortname },
    });

    if (!lecturer) {
      throw new BadRequestException(
        `Lecturer with shortname '${lecturerShortname}' does not exist.`
      );
    }

    const quote = this.quoteRepo.create({ content, lecturer });
    const saved = await this.quoteRepo.save(quote);
    return Serializer.response(saved);
  }

  // PUT /quote/:id
  async updateQuote(id: number, updateQuoteDto: UpdateQuoteDto): Promise<QuoteResponse> {
    let { quote, lecturerShortName } = updateQuoteDto;

    const foundQuote = await this.quoteRepo.findOne({
      where: { id },
      relations: ['lecturer'],
    });

    if (!foundQuote) throw new NotFoundException(`Quote with ID ${id} not found.`);

    // Fallback to existing values if not provided
    if (lecturerShortName === undefined) lecturerShortName = foundQuote.lecturer.shortName;
    if (quote === undefined) quote = foundQuote.content;

    const lecturer = await this.lecturerRepo.findOne({
      where: { shortName: lecturerShortName },
    });

    if (!lecturer) {
      throw new BadRequestException(
        `Lecturer with shortname '${lecturerShortName}' does not exist.`
      );
    }

    foundQuote.content = quote;
    foundQuote.lecturer = lecturer;

    const found = await this.quoteRepo.save(foundQuote);
    return Serializer.response(found);
  }

  // DELETE /quote/:id
  async deleteQuote(id: number): Promise<void> {
    const quote = await this.quoteRepo.findOne({
      where: { id },
      relations: ['lecturer'],
    });

    if (!quote) throw new NotFoundException(`Quote with ID ${id} not found.`);

    const lecturer = quote.lecturer;
    await this.quoteRepo.remove(quote);

    // If lecturer has no more quotes, delete lecturer too
    const remaining = await this.quoteRepo.count({
      where: { lecturer: { id: lecturer.id } },
    });
    if (remaining === 0) {
      await this.lecturerRepo.remove(lecturer);
    }
  }
}
