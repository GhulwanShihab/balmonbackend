import { z } from 'zod';

export const DeskripsiSchema = z.object({
    foto: z.string().min(1),
    title: z.string().min(1).max(255),
    deskripsi: z.string().min(1),
    url: z.string().url(),
    publishedAt: z.optional(z.string()), 
});

export type DeskripsiDTO = z.infer<typeof DeskripsiSchema>;