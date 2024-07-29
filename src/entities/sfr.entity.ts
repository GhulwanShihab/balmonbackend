import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SFR {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;
}
