import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Teks } from './teks.entity';

@Entity('visi-misi') // Nama tabel dalam database
export class VisiMisi {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: 'varchar', nullable: false })
    foto: string;

    @Column({ type: 'varchar', nullable: false })
    titleVisi: string;

    @Column({ type: 'varchar', nullable: false })
    titleMisi: string;

    @OneToMany(() => Teks, teks => teks.deskripsiVisi, { cascade: true })
    deskripsiVisi: Teks[];

    @OneToMany(() => Teks, teks => teks.deskripsiMisi, { cascade: true })
    deskripsiMisi: Teks[];

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
