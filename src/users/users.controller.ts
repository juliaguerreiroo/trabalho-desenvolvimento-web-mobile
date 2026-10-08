import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req } from '@nestjs/common';
import { CreateUserDTO } from 'src/dtos/create-users-dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(
       private service: UsersService
    ) { }

    @Post()
    async create(@Body() body: CreateUserDTO) {
        //chamar o service aqui
        await this.service.createUser(body);
    }

    @Get()
    async findAll(@Req() request: { user: { sub: number } }) {
        return await this.service.getUser(request.user.sub);
    }

    @Put(':id')
    async update(@Req() request: { user: { sub: number } },
                 @Param('id', ParseIntPipe) id: number,
                 @Body() body: CreateUserDTO) 
    {
        await this.service.updateUser(request.user.sub, id, body);
    }
    
    @Delete(':id')
    async delete(@Req() request: { user: { sub: number } }, @Param('id', ParseIntPipe) id: number) {
        await this.service.deleteUser(request.user.sub, id);
    }


}