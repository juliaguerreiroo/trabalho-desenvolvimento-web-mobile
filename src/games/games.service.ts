import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateGameDto } from 'src/dtos/create-game-dto';
import { UpdateGameDto } from 'src/dtos/update-game-dto';

@Injectable()
export class GamesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateGameDto) {
    await this.ensureCategoriesExist(dto.categoryIds);
    return this.prisma.game.create({
      data: {
        name: dto.name,
        categories: dto.categoryIds?.length
          ? { connect: dto.categoryIds.map((id) => ({ id })) }
          : undefined,
      },
      include: { categories: true },
    });
  }

  findAll() {
    return this.prisma.game.findMany({
      include: { categories: true },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    const game = await this.prisma.game.findUnique({
      where: { id },
      include: { categories: true },
    });
    if (!game) throw new NotFoundException('Jogo não encontrado.');
    return game;
  }

  async update(id: number, dto: UpdateGameDto) {
    await this.findOne(id);
    await this.ensureCategoriesExist(dto.categoryIds);
    return this.prisma.game.update({
      where: { id },
      data: {
        name: dto.name,
        categories: dto.categoryIds
          ? { set: dto.categoryIds.map((categoryId) => ({ id: categoryId })) }
          : undefined,
      },
      include: { categories: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    try {
      return await this.prisma.game.delete({ where: { id } });
    } catch {
      throw new BadRequestException('Não foi possível remover o jogo.');
    }
  }

  private async ensureCategoriesExist(categoryIds?: number[]) {
    if (!categoryIds?.length) return;
    const count = await this.prisma.category.count({ where: { id: { in: categoryIds } } });
    if (count !== new Set(categoryIds).size) {
      throw new BadRequestException('Uma ou mais categorias não foram encontradas.');
    }
  }
}
