import { Controller, Get, Post, Body, Param, Delete, Query, Put, UseInterceptors, UploadedFiles, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { InstagramService } from './instagram.service';
import { Instagram } from 'src/entities/instagram.entity';
import { QueryDto } from 'src/lib/query.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrl } from 'src/lib/file-upload.util';
import { CreateInstagramDto } from './dto/create-instagram.dto';
import { UpdateInstagramDto } from './dto/update-instagram.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from 'src/auth/decorators/roles.decorators';

@Controller('instagrams')
@ApiTags('instagrams')
export class InstagramController {
  constructor(private readonly instagramService: InstagramService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post(':userId')
  @ApiOperation({ summary: 'Create a new Instagram' })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file', 'file2', 'judulInstagram', 'deskripsiInstagram', 'tanggalInstagram', 'authorInstagram', 'editorInstagram', 'publishedAt'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'File upload',
          example: 'file.jpg',
        },
        file2: {
          type: 'string',
          format: 'binary',
          description: 'File upload',
          example: 'file2.jpg',
        },
        judulInstagram: { type: 'string', example: 'Judul Instagram', description: 'Judul dari Instagram' },
        deskripsiInstagram: {
          type: 'array',
          items: {
            type: 'string',
          },
          example: ['Deskripsi 1', 'Deskripsi 2'],
          description: 'Deskripsi dari Instagram',
        },
        tanggalInstagram: { type: 'string', example: '2024-07-03', description: 'Tanggal Instagram' },
        authorInstagram: { type: 'string', example: 'John Doe', description: 'Penulis Instagram' },
        editorInstagram: { type: 'string', example: 'Jane Doe', description: 'Editor Instagram' },
        publishedAt: { type: 'string', example: '2024-07-03T04:48:57.000Z', description: 'Tanggal dipublikasikan' },
      },
    },
  })
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'file', maxCount: 1 },
    { name: 'file2', maxCount: 1 },
  ], fileUploadOptions('instagrams')))
  async create(
    @Param('userId') userId: string,
    @UploadedFiles() files: { file: Express.Multer.File, file2: Express.Multer.File },
    @Body() createInstagramDto: CreateInstagramDto,
  ): Promise<Instagram> {
    if (typeof createInstagramDto.deskripsiInstagram === 'string') {
      createInstagramDto.deskripsiInstagram = [createInstagramDto.deskripsiInstagram];
    }
    const fotoInstagram = getFileUrl('instagrams', files.file[0]);
    const fotoContent = getFileUrl('instagrams', files.file2[0]);

    try {
      return this.instagramService.create(createInstagramDto, userId, fotoInstagram, fotoContent);
    } catch (error) {
      console.error('Create Instagram - Error:', error);
      throw new HttpException('Failed to create Instagram', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all Instagrams' })
  @ApiResponse({ status: 200, description: 'Returns all Instagrams' })
  async findAll(@Query() query: QueryDto): Promise<{ data: Instagram[], total: number }> {
    console.log('Find All Instagrams - query:', query);
    return this.instagramService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an Instagram by ID' })
  @ApiParam({ name: 'id', description: 'Instagram ID' })
  @ApiResponse({ status: 200, description: 'Returns the Instagram' })
  async findOne(@Param('id') id: string): Promise<Instagram> {
    console.log('Find One Instagram - id:', id);
    return this.instagramService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put(':id/:userId')
  @ApiOperation({ summary: 'Update an Instagram by ID' })
  @ApiParam({ name: 'id', description: 'Instagram ID' })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'File upload',
          example: 'file.jpg',
        },
        file2: {
          type: 'string',
          format: 'binary',
          description: 'File upload',
          example: 'file2.jpg',
        },
        judulInstagram: { type: 'string', example: 'Judul Instagram', description: 'Judul dari Instagram' },
        deskripsiInstagram: { type: 'array', items: { type: 'string' }, example: ['Deskripsi 1', 'Deskripsi 2'], description: 'Deskripsi dari Instagram' },
        tanggalInstagram: { type: 'string', example: '2024-07-03', description: 'Tanggal Instagram' },
        authorInstagram: { type: 'string', example: 'John Doe', description: 'Penulis Instagram' },
        editorInstagram: { type: 'string', example: 'Jane Doe', description: 'Editor Instagram' },
        publishedAt: { type: 'string', example: '2024-07-03T04:48:57.000Z', description: 'Tanggal dipublikasikan' },
      },
    },
  })
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'file', maxCount: 1 },
    { name: 'file2', maxCount: 1 },
  ], fileUploadOptions('instagrams')))
  async update(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @UploadedFiles() files: { file?: Express.Multer.File[], file2?: Express.Multer.File[] },
    @Body() updateInstagramDto: UpdateInstagramDto,
  ): Promise<Instagram> {
    let fotoInstagram: string | undefined;
    let fotoContent: string | undefined;

    if (files.file && files.file.length > 0) {
      fotoInstagram = getFileUrl('instagrams', files.file[0]);
    }

    if (files.file2 && files.file2.length > 0) {
      fotoContent = getFileUrl('instagrams', files.file2[0]);
    }
    try {
      return this.instagramService.update(id, userId, updateInstagramDto, fotoInstagram, fotoContent);
    } catch (error) {
      console.error('Update Instagram - Error:', error);
      throw new HttpException('Failed to update Instagram', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an Instagram by ID' })
  @ApiParam({ name: 'id', description: 'Instagram ID' })
  @ApiBearerAuth()
  @ApiResponse({ status: 204, description: 'Instagram successfully deleted' })
  async remove(@Param('id') id: string): Promise<void> {
    console.log('Delete Instagram - id:', id);
    return this.instagramService.remove(id);
  }
}
