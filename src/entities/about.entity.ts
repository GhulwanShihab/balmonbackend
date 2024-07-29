import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('abouts')
export class About {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: 'varchar', nullable: false })
    fotoAbout: string;

    @Column({ type: 'varchar', nullable: false })
    title: string

    @Column({ type: 'text', nullable: false })
    deskripsi: string

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