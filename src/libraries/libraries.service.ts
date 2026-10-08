import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { AddLibraryGameDto } from 'src/dtos/add-library-game-dto';
import { CreateLibraryDto } from 'src/dtos/create-library-dto';

@Injectable()
export class LibrariesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado.');

    const existing = await this.prisma.library.findUnique({ where: { userId } });
    if (existing) throw new ConflictException('Usuário já possui uma biblioteca.');

    return this.prisma.library.create({
      data: { userId },
      include: { games: { include: { game: true } } },
    });
  }

  findAll(userId: number) {
    return this.prisma.library.findMany({
      where: { userId },
      include: { games: { include: { game: true } } },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(userId: number, id: number) {
    const library = await this.prisma.library.findUnique({
      where: { id },
      include: { games: { include: { game: true } } },
    });
    if (!library || library.userId !== userId) {
      throw new NotFoundException('Biblioteca não encontrada.');
    }
    return library;
  }

  async addGame(userId: number, libraryId: number, gameId: number, dto: AddLibraryGameDto) {
    await this.findOne(userId, libraryId);
    const game = await this.prisma.game.findUnique({ where: { id: gameId } });
    if (!game) throw new NotFoundException('Jogo não encontrado.');

    await this.prisma.gamesOnLibrary.upsert({
      where: { libraryId_gameId: { libraryId, gameId } },
      create: { libraryId, gameId, timePlayed: dto.timePlayed },
      update: { timePlayed: dto.timePlayed },
    });
    return this.findOne(userId, libraryId);
  }

  async removeGame(userId: number, libraryId: number, gameId: number) {
    await this.findOne(userId, libraryId);
    try {
      await this.prisma.gamesOnLibrary.delete({
        where: { libraryId_gameId: { libraryId, gameId } },
      });
    } catch {
      throw new NotFoundException('Jogo não está na biblioteca.');
    }
    return this.findOne(userId, libraryId);
  }
}
