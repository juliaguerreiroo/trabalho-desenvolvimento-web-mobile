import { BadRequestException, ForbiddenException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateGameDto } from 'src/dtos/create-game-dto';
import { UpdateGameDto } from 'src/dtos/update-game-dto';

@Injectable()
export class GamesService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  onModuleInit() {
    const interval = setInterval(() => void this.refreshDiscounts(), 24 * 60 * 60 * 1000);
    interval.unref();
  }

  async create(ownerId: number, dto: CreateGameDto) {
    await this.ensureCategoriesExist(dto.categoryIds);
    return this.prisma.game.create({
      data: {
        name: dto.name,
        price: dto.price,
        ownerId,
        categories: dto.categoryIds?.length
          ? { connect: dto.categoryIds.map((id) => ({ id })) }
          : undefined,
      },
      include: { categories: true, owner: { select: { id: true, name: true } } },
    });
  }

  findAll() {
    return this.prisma.game.findMany({
      include: { categories: true, owner: { select: { id: true, name: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async catalog() {
    const games = await this.findAll();
    return {
      games: games.filter((game) => game.currentDiscount === 0),
      discountedGames: games.filter((game) => game.currentDiscount > 0),
      generatedAt: new Date(),
    };
  }

  async refreshDiscounts() {
    const games = await this.prisma.game.findMany({ select: { id: true } });
    await this.prisma.$transaction(
      games.map((game) => this.prisma.game.update({
        where: { id: game.id },
        data: {
          currentDiscount: Math.floor(Math.random() * 46) + 5,
          discountUpdatedAt: new Date(),
        },
      })),
    );
    return { updatedGames: games.length, updatedAt: new Date() };
  }

  async findOne(id: number) {
    const game = await this.prisma.game.findUnique({
      where: { id },
      include: { categories: true },
    });
    if (!game) throw new NotFoundException('Jogo não encontrado.');
    return game;
  }

  async update(ownerId: number, id: number, dto: UpdateGameDto) {
    const game = await this.findOne(id);
    if (game.ownerId !== ownerId) throw new ForbiddenException('Você só pode alterar jogos criados por você.');
    await this.ensureCategoriesExist(dto.categoryIds);
    return this.prisma.game.update({
      where: { id },
      data: {
        name: dto.name,
        price: dto.price,
        categories: dto.categoryIds
          ? { set: dto.categoryIds.map((categoryId) => ({ id: categoryId })) }
          : undefined,
      },
      include: { categories: true, owner: { select: { id: true, name: true } } },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    throw new BadRequestException('Jogos publicados não podem ser excluídos.');
  }

  private async ensureCategoriesExist(categoryIds?: number[]) {
    if (!categoryIds?.length) return;
    const count = await this.prisma.category.count({ where: { id: { in: categoryIds } } });
    if (count !== new Set(categoryIds).size) {
      throw new BadRequestException('Uma ou mais categorias não foram encontradas.');
    }
  }
}
