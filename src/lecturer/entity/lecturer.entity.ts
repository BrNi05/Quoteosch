import { Entity, Column, PrimaryGeneratedColumn, OneToMany, UpdateDateColumn } from 'typeorm';
import { Quote } from '../../quote/entity/quote.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Lecturer {
  @ApiProperty({ description: 'A unique, auto-generated identifier for all records.' })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({ description: 'The shortened, unique name of the lecturer.' })
  @Column({ unique: true })
  shortName!: string;

  @ApiProperty({ description: 'The full name of the lecturer.' })
  @Column()
  fullName!: string;

  @ApiProperty({ description: 'The quotes associated with this lecturer.' })
  @OneToMany(() => Quote, (quote) => quote.lecturer)
  quotes!: Quote[];

  @ApiProperty({ description: 'Timestamp of the last modification.' })
  @UpdateDateColumn({ type: 'datetime' })
  lastModifiedAt!: Date;
}
