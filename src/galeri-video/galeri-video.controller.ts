import { Controller, Get, Post, Body, Param, Delete, Put, UseInterceptors, UploadedFile, Query, UseGuards } from '@nestjs/common';
import { VideoService } from './galeri-video.service';
import { GaleriVideo } from 'src/entities/galeri-video.entity';
import { CreateVideoDto } from './dto/create-galeri-video.dto';
import { UpdateVideoDto } from './dto/update-galeri-video.dto';
import { QueryDto } from 'src/lib/query.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { RolesGuard } from 'src/auth/guards/roles.guards';

@Controller('galeri-videos')
@ApiTags('galeri-videos')
export class VideoController {
    constructor(private readonly videoService: VideoService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post(':userId')
    @ApiOperation({ summary: 'Create a new StrukturPengurus' })
    @ApiBearerAuth()
    @ApiConsumes('application/json')
    @ApiBody({
      schema: {
          type: 'object',
          required: ['title', 'linkvideo'],
          properties: {
              title: {
                  type: 'string',
                  description: 'Judul Video',
                  example: 'Judul Video',
              },
              linkvideo: {
                  type: 'string',
                  description: 'Link Video',
                  example: 'URL tujuan.',
              },
          },
      },
  })
    async create(
        @Param('userId') userId: string,
        @Body() createVideoDto: CreateVideoDto,
    ): Promise<GaleriVideo> {
        return this.videoService.create(createVideoDto, userId);
    }

    @Get()
    @ApiOperation({ summary: 'Get all StrukturPengurus' })
    @ApiResponse({ status: 200, description: 'Returns all GaleriVideo' })
    async findAll(@Query() query: QueryDto): Promise<{ data: GaleriVideo[], total: number }> {
        return this.videoService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a GaleriVideo by ID' })
    @ApiParam({ name: 'id', description: 'GaleriVideo ID' })
    @ApiResponse({ status: 200, description: 'Returns the GaleriVideo' })
    async findOne(@Param('id') id: string): Promise<GaleriVideo> {
        return this.videoService.findOne(id);
    }
        
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Put(':id/:userId')
    @ApiOperation({ summary: 'Update a GaleriVideo by ID' })
    @ApiParam({ name: 'id', description: 'GaleriVideo ID' })
    @ApiBearerAuth()
    @ApiConsumes('application/json')
    @ApiBody({
      schema: {
          type: 'object',
          properties: {
              title: {
                  type: 'string',
                  description: 'Judul Video',
                  example: 'Deskripsi Title',
              },
              linkvideo: {
                  type: 'string',
                  description: 'Link Video',
                  example: 'URL tujuan.',
              },
          },
          required: ['title', 'linkvideo'],
      },
    })
    async update(
        @Param('id') id: string,
        @Param('userId') userId: string,
        @Body() updateVideoDto: UpdateVideoDto,
    ): Promise<GaleriVideo> {
        return this.videoService.update(id, userId, updateVideoDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a GaleriVideo by ID' })
    @ApiParam({ name: 'id', description: 'GaleriVideo ID' })
    @ApiBearerAuth()
    @ApiResponse({ status: 204, description: 'GaleriVideo successfully deleted' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.videoService.remove(id);
    }
}