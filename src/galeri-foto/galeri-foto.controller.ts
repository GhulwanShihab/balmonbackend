import { Controller, Get, Post, Body, Param, Delete, Query, Put, UseInterceptors, UploadedFile, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { GaleriFotoService } from './galeri-foto.service';
import { GaleriFoto } from 'src/entities/galeri-foto.entity';
import { QueryDto } from 'src/lib/query.dto';
import { FileInterceptor } from '@nestjs/platform-express'; // Sesuaikan interceptor yang digunakan
import { fileUploadOptions, getFileUrl } from 'src/lib/file-upload.util';
import { CreateGaleriFotoDto } from './dto/create-galeri-foto.dto';
import { UpdateGaleriFotoDto } from './dto/update-galeri-foto.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from 'src/auth/decorators/roles.decorators';

@Controller('galeri-foto')
@ApiTags('galeri-foto')
export class GaleriFotoController {
  constructor(private readonly galeriFotoService: GaleriFotoService) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post(':userId')
  @ApiOperation({ summary: 'Create a new Galeri Foto' })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file', 'judulFoto'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'File upload',
          example: 'file.jpg',
        },
        judulFoto: { type: 'string', example: 'Judul Foto', description: 'Judul dari foto' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', fileUploadOptions('galeri-foto')))
  async create(
    @Param('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() createGaleriFotoDto: CreateGaleriFotoDto,
  ): Promise<GaleriFoto> {
    const foto = getFileUrl('galeri-foto', file);

    try {
      return this.galeriFotoService.create(createGaleriFotoDto, userId, foto);
    } catch (error) {
      console.error('Create Galeri Foto - Error:', error);
      throw new HttpException('Failed to create Galeri Foto', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all Galeri Fotos' })
  @ApiResponse({ status: 200, description: 'Returns all Galeri Fotos' })
  async findAll(@Query() query: QueryDto): Promise<{ data: GaleriFoto[], total: number }> {
    console.log('Find All Galeri Fotos - query:', query);
    return this.galeriFotoService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a Galeri Foto by ID' })
  @ApiParam({ name: 'id', description: 'Galeri Foto ID' })
  @ApiResponse({ status: 200, description: 'Returns the Galeri Foto' })
  async findOne(@Param('id') id: string): Promise<GaleriFoto> {
    console.log('Find One Galeri Foto - id:', id);
    return this.galeriFotoService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put(':id/:userId')
  @ApiOperation({ summary: 'Update a Galeri Foto by ID' })
  @ApiParam({ name: 'id', description: 'Galeri Foto ID' })
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
        judulFoto: { type: 'string', example: 'Judul Foto', description: 'Judul dari foto' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', fileUploadOptions('galeri-foto')))
  async update(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Body() updateGaleriFotoDto: UpdateGaleriFotoDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<GaleriFoto> {
    let foto: string | undefined;

    if (file) {
      foto = getFileUrl('galeri-foto', file);
    }

    try {
      return this.galeriFotoService.update(id, userId, updateGaleriFotoDto, foto);
    } catch (error) {
      console.error('Update Galeri Foto - Error:', error);
      throw new HttpException('Failed to update Galeri Foto', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Galeri Foto by ID' })
  @ApiParam({ name: 'id', description: 'Galeri Foto ID' })
  @ApiBearerAuth()
  @ApiResponse({ status: 204, description: 'Galeri Foto successfully deleted' })
  async remove(@Param('id') id: string): Promise<void> {
    console.log('Delete Galeri Foto - id:', id);
    return this.galeriFotoService.remove(id);
  }
}
