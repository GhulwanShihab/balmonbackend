import { z } from 'zod';

export const IkrapSchema = z.object({
    foto: z.string().min(1),
    title: z.string().min(1).max(255),
    deskripsi: z.string().min(1),
    url: z.string().url(),
    publishedAt: z.optional(z.string()), 
});

export type IkrapDTO = z.infer<typeof IkrapSchema>;