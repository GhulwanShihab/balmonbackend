import { z } from 'zod';

export const UpdateVisiMisiSchema = z.object({
    foto: z.string().optional(),
    titleVisi: z.string().optional(),
    titleMisi: z.string().optional(),
    deskripsiVisi: z.array(z.string()).optional(),
    deskripsiMisi: z.array(z.string()).optional(),
    publishedAt: z.optional(z.string()).optional(), 
});

export type UpdateVisiMisiDto = z.infer<typeof UpdateVisiMisiSchema>;