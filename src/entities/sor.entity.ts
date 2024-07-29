import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SOR {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;
}
