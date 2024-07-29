import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

// Define the schema using zod for validation
export const CreateVideoSchema = z.object({
    title: z.string(),
    linkvideo: z.string(),
    publishedAt: z.string(),  // Make publishedAt optional if necessary
});

// Define the DTO class
export class CreateVideoDto {
    @ApiProperty({ example: 'Introduction to NestJS' })
    title: string;

    @ApiProperty({ example: 'https://example.com/video.mp4' })
    linkvideo: string;

    @ApiProperty({ example: '2024-07-03T04:48:57.000Z' })
    publishedAt: string;

    constructor(data: any) {
        // Validate and parse the incoming data
        const validatedData = CreateVideoSchema.parse(data);
        this.title = validatedData.title;
        this.linkvideo = validatedData.linkvideo;
        this.publishedAt = validatedData.publishedAt;
    }
}
