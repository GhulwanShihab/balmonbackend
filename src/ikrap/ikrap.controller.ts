import { Controller, Post, Body, Get, Put, Param, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { IkrapService } from './ikrap.service'; // Pastikan ini sesuai dengan service Anda
import { IkrapDTO } from './dto/ikrap.dto';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrl } from 'src/lib/file-upload.util';

@ApiTags('ikrap')
@Controller('ikrap')
export class IkrapController {
    constructor(private readonly ikrapService: IkrapService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post()
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('ikrap')))
    async createOrUpdate(@Body() ikrapDto: IkrapDTO, @UploadedFile() file: Express.Multer.File): Promise<any> {
        const imgSrc = getFileUrl('ikrap', file);
        return await this.ikrapService.createOrUpdate(ikrapDto, imgSrc);
    }

    @Get()
    @ApiOperation({ summary: 'Get a Ikrap by ID' })
    async findOne(): Promise<any> {
        return await this.ikrapService.findOne();
    }
}
