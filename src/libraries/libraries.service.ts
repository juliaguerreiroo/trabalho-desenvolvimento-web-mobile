import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { AddLibraryGameDto } from 'src/dtos/add-library-game-dto';
import { CreateLibraryDto } from 'src/dtos/create-library-dto';

@Injectable()
export class LibrariesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateLibraryDto) {
    const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado.');

    const existing = await this.prisma.library.findUnique({ where: { userId: dto.userId } });
    if (existing) throw new ConflictException('Usuário já possui uma biblioteca.');

    return this.prisma.library.create({
      data: { userId: dto.userId },
      include: { games: { include: { game: true } } },
    });
  }

  findAll() {
    return this.prisma.library.findMany({
      include: { games: { include: { game: true } } },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const library = await this.prisma.library.findUnique({
      where: { id },
      include: { games: { include: { game: true } } },
    });
    if (!library) throw new NotFoundException('Biblioteca não encontrada.');
    return library;
  }

  async addGame(libraryId: number, gameId: number, dto: AddLibraryGameDto) {
    await this.findOne(libraryId);
    const game = await this.prisma.game.findUnique({ where: { id: gameId } });
    if (!game) throw new NotFoundException('Jogo não encontrado.');

    await this.prisma.gamesOnLibrary.upsert({
      where: { libraryId_gameId: { libraryId, gameId } },
      create: { libraryId, gameId, timePlayed: dto.timePlayed },
      update: { timePlayed: dto.timePlayed },
    });
    return this.findOne(libraryId);
  }

  async removeGame(libraryId: number, gameId: number) {
    await this.findOne(libraryId);
    try {
      await this.prisma.gamesOnLibrary.delete({
        where: { libraryId_gameId: { libraryId, gameId } },
      });
    } catch {
      throw new NotFoundException('Jogo não está na biblioteca.');
    }
    return this.findOne(libraryId);
  }
}
