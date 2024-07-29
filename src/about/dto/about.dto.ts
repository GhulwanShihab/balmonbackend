import { z } from 'zod';

export const AboutSchema = z.object({
    foto: z.string().min(1),
    title: z.string().min(1).max(255),
    deskripsi: z.string().min(1),
    publishedAt: z.optional(z.string()), 
});

export type AboutDTO = z.infer<typeof AboutSchema>;