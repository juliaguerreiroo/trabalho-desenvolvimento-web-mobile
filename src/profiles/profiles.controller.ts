import {
    Controller,
    Post,
    Get,
    Put,
    Param,
    Body,
    ParseIntPipe,
    Req,
} from '@nestjs/common';
import { CreateProfileDto } from 'src/dtos/create-profile-dto';
import { UpdateProfileDto } from 'src/dtos/update-profile-dto';
import { ProfilesService } from './profiles.service';
@Controller('profiles')
export class ProfilesController {
    constructor(private profilesService: ProfilesService) { }
    @Post()
    async create(@Req() request: { user: { sub: number } }, @Body() dto: CreateProfileDto) {
        return this.profilesService.create(request.user.sub, dto);
    }
    @Get(':id')
    async findOne(
        @Req() request: { user: { sub: number } },
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.profilesService.findOne(request.user.sub, id);
    }
    @Put(':id')
    async update(
        @Req() request: { user: { sub: number } },
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateProfileDto,
    ) {
        return this.profilesService.update(request.user.sub, id, dto);
    }
}