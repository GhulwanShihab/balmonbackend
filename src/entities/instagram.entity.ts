import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Teks } from './teks.entity';

@Entity('instagrams') // Mengubah nama tabel menjadi 'instagrams'
export class Instagram {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  judulInstagram: string; // Mengubah nama kolom

  @OneToMany(() => Teks, teks => teks.instagram, { cascade: true }) // Mengubah relasi dengan Teks entity
  deskripsiInstagram: Teks[]; // Mengubah nama properti

  @Column({ type: 'date', nullable: false })
  tanggalInstagram: string; // Mengubah nama kolom

  @Column({ type: 'varchar', nullable: false })
  fotoInstagram: string; // Mengubah nama kolom

  @Column({ type: 'varchar', nullable: false })
  authorInstagram: string; // Mengubah nama kolom

  @Column({ type: 'varchar', nullable: false })
  editorInstagram: string; // Mengubah nama kolom

  @Column({ type: 'varchar', nullable: false })
  fotoContent: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  publishedAt: Date;

  @ManyToOne(() => User, { nullable: true })
  createdBy: User;

  @ManyToOne(() => User, { nullable: true })
  updatedBy: User;
}
