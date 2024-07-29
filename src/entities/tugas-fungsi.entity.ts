import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tugas_fungsi')
export class TugasFungsi {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tugas: string;

  @Column()
  fungsi: string;
}
