import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Lecturer } from '../../lecturer/entity/lecturer.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Quote {
  @ApiProperty({ description: 'A unique, auto-generated identifier for all records.' })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({ description: 'A quote text itself.' })
  @Column()
  content!: string;

  @ApiProperty({ description: 'The lecturer associated with this quote.' })
  @ManyToOne(() => Lecturer, (lecturer) => lecturer.quotes)
  @JoinColumn()
  lecturer!: Lecturer;

  @ApiProperty({ description: 'Timestamp of the last modification.' })
  @UpdateDateColumn({ type: 'datetime' })
  lastModifiedAt!: Date;
}
