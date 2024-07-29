import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Berita} from './berita.entity';
import { Instagram} from './instagram.entity';



@Entity('teks')
export class Teks {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column('text')
    str: string
    @Column('int')
    order: number;
    @ManyToOne(() => Berita, berita => berita.deskripsiBerita, {nullable: true, onDelete:"CASCADE"})
    berita: Berita;
    @ManyToOne(() => Instagram, instagram => instagram.deskripsiInstagram, {nullable: true, onDelete:"CASCADE"})
    instagram: Instagram;
}