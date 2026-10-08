import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateCategoryDto } from 'src/dtos/create-category-dto';
import { UpdateCategoryDto } from 'src/dtos/update-category-dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateCategoryDto) {
    return this.ensureGamesExist(dto.gameIds).then(() => this.prisma.category.create({
      data: {
        name: dto.name,
        games: dto.gameIds?.length
          ? { connect: dto.gameIds.map((id) => ({ id })) }
          : undefined,
      },
      include: { games: true },
    }));
  }

  findAll() {
    return this.prisma.category.findMany({
      include: { games: true },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { games: true },
    });
    if (!category) throw new NotFoundException('Categoria não encontrada.');
    return category;
  }

  async update(id: number, dto: UpdateCategoryDto) {
    await this.findOne(id);
    await this.ensureGamesExist(dto.gameIds);
    return this.prisma.category.update({
      where: { id },
      data: {
        name: dto.name,
        games: dto.gameIds
          ? { set: dto.gameIds.map((gameId) => ({ id: gameId })) }
          : undefined,
      },
      include: { games: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.category.delete({ where: { id } });
  }

  private async ensureGamesExist(gameIds?: number[]) {
    if (!gameIds?.length) return;
    const count = await this.prisma.game.count({ where: { id: { in: gameIds } } });
    if (count !== new Set(gameIds).size) {
      throw new BadRequestException('Um ou mais jogos não foram encontrados.');
    }
  }
}
