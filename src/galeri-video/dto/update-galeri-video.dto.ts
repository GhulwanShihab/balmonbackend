import { z } from 'zod';
import { ApiPropertyOptional } from '@nestjs/swagger';

// Define the schema using zod for validation
export const UpdateVideoSchema = z.object({
    title: z.string().optional(),
    linkvideo: z.string().optional(),
    publishedAt: z.string().optional(),
});

// Define the DTO class
export class UpdateVideoDto {
    @ApiPropertyOptional({ example: 'Introduction to NestJS' })
    title?: string;

    @ApiPropertyOptional({ example: 'https://example.com/video.mp4' })
    linkvideo?: string;

    @ApiPropertyOptional({ example: '2024-07-03T04:48:57.000Z' })
    publishedAt?: string;

    constructor(data: any) {
        // Validate and parse the incoming data
        const validatedData = UpdateVideoSchema.parse(data);
        this.title = validatedData.title;
        this.linkvideo = validatedData.linkvideo;
        this.publishedAt = validatedData.publishedAt;
    }
}
