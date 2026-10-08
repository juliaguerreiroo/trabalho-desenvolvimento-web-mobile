import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Req } from '@nestjs/common';
import { AddLibraryGameDto } from 'src/dtos/add-library-game-dto';
import { LibrariesService } from './libraries.service';

@Controller('libraries')
export class LibrariesController {
  constructor(private readonly librariesService: LibrariesService) {}

  @Post()
  create(@Req() request: { user: { sub: number } }) {
    return this.librariesService.create(request.user.sub);
  }

  @Get()
  findAll(@Req() request: { user: { sub: number } }) {
    return this.librariesService.findAll(request.user.sub);
  }

  @Get(':id')
  findOne(@Req() request: { user: { sub: number } }, @Param('id', ParseIntPipe) id: number) {
    return this.librariesService.findOne(request.user.sub, id);
  }

  @Post(':libraryId/games/:gameId')
  addGame(
    @Req() request: { user: { sub: number } },
    @Param('libraryId', ParseIntPipe) libraryId: number,
    @Param('gameId', ParseIntPipe) gameId: number,
    @Body() dto: AddLibraryGameDto,
  ) {
    return this.librariesService.addGame(request.user.sub, libraryId, gameId, dto);
  }

  @Delete(':libraryId/games/:gameId')
  removeGame(
    @Req() request: { user: { sub: number } },
    @Param('libraryId', ParseIntPipe) libraryId: number,
    @Param('gameId', ParseIntPipe) gameId: number,
  ) {
    return this.librariesService.removeGame(request.user.sub, libraryId, gameId);
  }
}
