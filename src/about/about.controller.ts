import { Controller, Post, Body, Get, Put, Param, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { AboutService } from './about.service';
import { AboutDTO } from './dto/about.dto';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrl } from 'src/lib/file-upload.util';

@ApiTags('about')
@Controller('about')
export class AboutController {
    constructor(private readonly aboutService: AboutService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post()
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('about')))
    async createOrUpdate(@Body() aboutDto: AboutDTO,  @UploadedFile() file: Express.Multer.File,): Promise<any> {
        const imgSrc = getFileUrl('about', file);
        return await this.aboutService.createOrUpdate(aboutDto, imgSrc);
    }

    @Get()
    @ApiOperation({ summary: 'Get a About by ID' })
    async findOne(): Promise<any> {
        return await this.aboutService.findOne();
    }
}