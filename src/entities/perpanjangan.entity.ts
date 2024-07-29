import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('perpanjangan') // Nama tabel dalam database
export class Perpanjangan {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: 'varchar', nullable: false })
    foto: string;

    @Column({ type: 'varchar', nullable: false })
    title: string;

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
