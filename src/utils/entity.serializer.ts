import type { Quote } from '../quote/entity/quote.entity';
import type { ContributeQuote } from '../quote/entity/contribute-quote.entity';
import type { Lecturer } from '../lecturer/entity/lecturer.entity';
import type { ContributeLecturer } from '../lecturer/entity/contribute-lecturer.entity';
import type { QuoteResponse } from '../quote/entity/response.entity';
import type { LecturerResponse } from '../lecturer/entity/response.entity';

export class Serializer {
  // Quote, ContributeQuote, Quote[], ContributeQuote[]
  static response(quote: Quote): QuoteResponse;
  static response(quote: ContributeQuote): QuoteResponse;
  static response(quotes: Quote[]): QuoteResponse[];
  static response(quotes: ContributeQuote[]): QuoteResponse[];

  // Lecturer, ContributeLecturer, Lecturer[], ContributeLecturer[]
  static response(lecturer: Lecturer): LecturerResponse;
  static response(lecturer: ContributeLecturer): LecturerResponse;
  static response(lecturers: Lecturer[]): LecturerResponse[];
  static response(lecturers: ContributeLecturer[]): LecturerResponse[];

  // Quote | ContributeQuote | Quote[] -> QuoteResponse | QuoteResponse[]
  // Lecturer | ContributeLecturer | Lecturer[] -> LecturerResponse | LecturerResponse[]
  static response(
    input:
      | Quote
      | Quote[]
      | ContributeQuote
      | ContributeQuote[]
      | Lecturer
      | Lecturer[]
      | ContributeLecturer
      | ContributeLecturer[]
  ): QuoteResponse | QuoteResponse[] | LecturerResponse | LecturerResponse[] {
    // Handle Quote[] and Lecturer[]
    // Sufnituning workaround to resolve types correctly from a union input
    if (Array.isArray(input)) {
      if (input.every((i): i is Quote | ContributeQuote => 'content' in i)) {
        return input.map((q) => this.response(q)); // returns QuoteResponse[]
      } else return input.map((l) => this.response(l)); // returns LecturerResponse[]
    }

    // Handle quotes
    if ('content' in input) {
      return {
        id: input.id,
        content: input.content,
        lecturer: input.lecturer.shortName,
        lastModifiedAt: input.lastModifiedAt,
      };
    }

    // Handle lecturers
    return {
      id: input.id,
      shortName: input.shortName,
      fullName: input.fullName,
      lastModifiedAt: input.lastModifiedAt,
    };
  }
}
