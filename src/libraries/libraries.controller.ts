import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { AddLibraryGameDto } from 'src/dtos/add-library-game-dto';
import { CreateLibraryDto } from 'src/dtos/create-library-dto';
import { LibrariesService } from './libraries.service';

@Controller('libraries')
export class LibrariesController {
  constructor(private readonly librariesService: LibrariesService) {}

  @Post()
  create(@Body() dto: CreateLibraryDto) {
    return this.librariesService.create(dto);
  }

  @Get()
  findAll() {
    return this.librariesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.librariesService.findOne(id);
  }

  @Post(':libraryId/games/:gameId')
  addGame(
    @Param('libraryId', ParseIntPipe) libraryId: number,
    @Param('gameId', ParseIntPipe) gameId: number,
    @Body() dto: AddLibraryGameDto,
  ) {
    return this.librariesService.addGame(libraryId, gameId, dto);
  }

  @Delete(':libraryId/games/:gameId')
  removeGame(
    @Param('libraryId', ParseIntPipe) libraryId: number,
    @Param('gameId', ParseIntPipe) gameId: number,
  ) {
    return this.librariesService.removeGame(libraryId, gameId);
  }
}
