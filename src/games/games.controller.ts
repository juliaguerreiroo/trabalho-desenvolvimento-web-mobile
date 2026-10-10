import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateGameDto } from 'src/dtos/create-game-dto';
import { UpdateGameDto } from 'src/dtos/update-game-dto';
import { GamesService } from './games.service';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post()
  create(@Req() request: { user: { sub: number } }, @Body() dto: CreateGameDto) {
    return this.gamesService.create(request.user.sub, dto);
  }

  @Get()
  findAll() {
    return this.gamesService.findAll();
  }

  @Get('catalog/featured')
  catalog() {
    return this.gamesService.catalog();
  }

  @Post('discounts/refresh')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  refreshDiscounts() {
    return this.gamesService.refreshDiscounts();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.gamesService.findOne(id);
  }

  @Put(':id')
  update(@Req() request: { user: { sub: number } }, @Param('id', ParseIntPipe) id: number, @Body() dto: UpdateGameDto) {
    return this.gamesService.update(request.user.sub, id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.gamesService.remove(id);
  }
}
