import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class ContributeLecturer {
  @ApiProperty({ description: 'A unique, auto-generated identifier for all records.' })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({ description: 'The shortened, unique name of the lecturer.' })
  @Column({ unique: true })
  shortName!: string;

  @ApiProperty({ description: 'The full name of the lecturer.' })
  @Column()
  fullName!: string;

  @ApiProperty({ description: 'Timestamp of the last modification.' })
  @UpdateDateColumn({ type: 'datetime' })
  lastModifiedAt!: Date;
}
