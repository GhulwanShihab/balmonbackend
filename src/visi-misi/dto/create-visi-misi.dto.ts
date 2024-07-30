import { z } from 'zod';

export const CreateVisiMisiSchema = z.object({
    foto: z.string(),
    titleVisi: z.string(),
    titleMisi: z.string(),
    deskripsiVisi: z.array(z.string()),
    deskripsiMisi: z.array(z.string()),
    publishedAt: z.optional(z.string()), 
});

export type CreateVisiMisiDto = z.infer<typeof CreateVisiMisiSchema>;