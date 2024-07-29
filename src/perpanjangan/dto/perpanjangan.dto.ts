import { z } from 'zod';

export const PerpanjanganSchema = z.object({
    foto: z.string().min(1),
    title: z.string().min(1).max(255),
    publishedAt: z.string().optional(), // Menambahkan publishedAt sebagai opsional
});

export type PerpanjanganDTO = z.infer<typeof PerpanjanganSchema>;
