import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('visi_misi')
export class VisiMisi {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  visi: string;

  @Column()
  misi: string;
}
