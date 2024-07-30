import { Controller, Get, Post, Body, Param, Delete, Put, UseInterceptors, UploadedFile, Query, UseGuards } from '@nestjs/common';
import { VisiMisiService } from './visi-misi.service';
import { VisiMisi } from 'src/entities/visi-misi.entity';
import { CreateVisiMisiDto } from './dto/create-visi-misi.dto';
import { UpdateVisiMisiDto } from './dto/update-visi-misi.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrl } from 'src/lib/file-upload.util';
import { QueryDto } from 'src/lib/query.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { RolesGuard } from 'src/auth/guards/roles.guards';

@Controller('visi-misi')
@ApiTags('visi-misi')
export class VisiMisiController {
    constructor(private readonly visiMisiService: VisiMisiService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post(':userId')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('visi-misi')))
    @ApiOperation({ summary: 'Create a new VisiMisi' })
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            required: ['file', 'nama', 'jabatan', 'publishedAt', 'tipe'],
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'File uploads',
                    example: 'file.jpg',
                },
                judulVisi: {
                    type: 'string',
                    description: 'Judul Visi',
                    example: 'Visi',
                },
                judulMisi: {
                    type: 'string',
                    description: 'Judul Misi',
                    example: 'Misi',
                },
                deskripsiVisi: {
                    type: 'array',
                    items: {
                        type: 'string',
                    },
                    description: 'Deskripsi Visi',
                    example: ['Deskripsi bagian 1', 'Deskripsi bagian 2'],
                },
                deskripsiMisi: {
                    type: 'array',
                    items: {
                        type: 'string',
                    },
                    description: 'Deskripsi Misi',
                    example: ['Deskripsi bagian 1', 'Deskripsi bagian 2'],
                },
                publishedAt: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Tanggal publikasi',
                    example: '2024-07-03T04:48:57.000Z',
                },
            },
        },
    })
    async create(
        @Param('userId') userId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() createVisiMisiDto: CreateVisiMisiDto,
    ): Promise<VisiMisi> {
        const imgSrc = getFileUrl('visi-misi', file);
        return this.visiMisiService.create(createVisiMisiDto, userId, imgSrc);
    }

    @Get()
    @ApiOperation({ summary: 'Get all VisiMisi' })
    @ApiResponse({ status: 200, description: 'Returns all VisiMisi' })
    async findAll(@Query() query: QueryDto): Promise<{ data: VisiMisi[], total: number }> {
        return this.visiMisiService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a VisiMisi by ID' })
    @ApiParam({ name: 'id', description: 'VisiMisi ID' })
    @ApiResponse({ status: 200, description: 'Returns the VisiMisi' })
    async findOne(@Param('id') id: string): Promise<VisiMisi> {
        return this.visiMisiService.findOne(id);
    }
        
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Put(':id/:userId')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('visi-misi')))
    @ApiOperation({ summary: 'Update a VisiMisi by ID' })
    @ApiParam({ name: 'id', description: 'VisiMisi ID' })
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'File uploads',
                    example: 'file.jpg',
                },
                judulVisi: {
                    type: 'string',
                    description: 'Judul Visi',
                    example: 'Visi',
                },
                judulMisi: {
                    type: 'string',
                    description: 'Judul Misi',
                    example: 'Misi',
                },
                deskripsiVisi: {
                    type: 'array',
                    items: {
                        type: 'string',
                    },
                    description: 'Deskripsi Visi',
                    example: ['Deskripsi bagian 1', 'Deskripsi bagian 2'],
                },
                deskripsiMisi: {
                    type: 'array',
                    items: {
                        type: 'string',
                    },
                    description: 'Deskripsi Misi',
                    example: ['Deskripsi bagian 1', 'Deskripsi bagian 2'],
                },
                publishedAt: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Tanggal publikasi',
                    example: '2024-07-03T04:48:57.000Z',
                },
            },
        },
    })
    async update(
        @Param('id') id: string,
        @Param('userId') userId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() updateVisiMisiDto: UpdateVisiMisiDto,
    ): Promise<VisiMisi> {
        const imgSrc = getFileUrl('visi-misi', file);
        return this.visiMisiService.update(id, userId, updateVisiMisiDto, imgSrc);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a VisiMisi by ID' })
    @ApiParam({ name: 'id', description: 'VisiMisi ID' })
    @ApiBearerAuth()
    @ApiResponse({ status: 204, description: 'VisiMisi successfully deleted' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.visiMisiService.remove(id);
    }
}
