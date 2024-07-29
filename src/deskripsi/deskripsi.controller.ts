import { Controller, Post, Body, Get, Put, Param, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { DeskripsiService } from './deskripsi.service'; // Pastikan ini sesuai dengan service Anda
import { DeskripsiDTO } from './dto/deskripsi.dto';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrl } from 'src/lib/file-upload.util';

@ApiTags('deskripsi')
@Controller('deskripsi')
export class DeskripsiController {
    constructor(private readonly deskripsiService: DeskripsiService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post()
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('deskripsi')))
    async createOrUpdate(@Body() deskripsiDto: DeskripsiDTO, @UploadedFile() file: Express.Multer.File): Promise<any> {
        const imgSrc = getFileUrl('deskripsi', file);
        return await this.deskripsiService.createOrUpdate(deskripsiDto, imgSrc);
    }

    @Get()
    @ApiOperation({ summary: 'Get a Deskripsi by ID' })
    async findOne(): Promise<any> {
        return await this.deskripsiService.findOne();
    }
}
