import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class PlansService {
  constructor(private prisma: PrismaService) {}

  async create(name: string, price: number, maxGames = 10, minDiscount = 5, maxDiscount = 15) {
    this.validateDiscounts(maxGames, minDiscount, maxDiscount);
    return this.prisma.plan.create({
      data: {
        name,
        price,
        maxGames,
        minDiscount,
        maxDiscount,
      },
    });
  }

  async findAll() {
    return this.prisma.plan.findMany();
  }

  async findOne(id: number) {
    const plan = await this.prisma.plan.findUnique({
      where: {
        id,
      },
    });
    if (!plan) throw new NotFoundException('Plano não encontrado.');
    return plan;
  }

  async subscribe(userId: number, planId: number) {
    const plan = await this.findOne(planId);
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
    if (!user) throw new NotFoundException('Usuário não encontrado.');

    const existing = await this.prisma.planSubscription.findFirst({
      where: { userId, planId, expiresAt: { gt: new Date() } },
      select: { id: true, expiresAt: true },
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    if (existing) {
      const renewed = new Date(Math.max(existing.expiresAt.getTime(), expiresAt.getTime()));
      return this.prisma.planSubscription.update({
        where: { id: existing.id },
        data: { expiresAt: renewed },
        include: { plan: true },
      });
    }

    return this.prisma.planSubscription.create({
      data: { userId, planId, expiresAt },
      include: { plan: true },
    });
  }

  async games(id: number) {
    const plan = await this.findOne(id);
    return this.prisma.planGame.findMany({
      where: { planId: plan.id },
      take: plan.maxGames,
      include: { game: { include: { categories: true } } },
    });
  }

  async userGames(userId: number) {
    const subscriptions = await this.prisma.planSubscription.findMany({
      where: { userId, expiresAt: { gt: new Date() } },
      include: { plan: { include: { games: { include: { game: { include: { categories: true } } } } } } },
    });
    return subscriptions.flatMap((subscription) =>
      subscription.plan.games.slice(0, subscription.plan.maxGames).map((entry) => ({
        ...entry.game,
        planId: subscription.planId,
        access: 'PLAN',
      })),
    );
  }

  async setGames(id: number, gameIds: number[]) {
    const plan = await this.findOne(id);
    if (new Set(gameIds).size !== gameIds.length) {
      throw new BadRequestException('Não é possível repetir jogos no plano.');
    }
    if (gameIds.length > plan.maxGames) {
      throw new BadRequestException('A quantidade de jogos excede o limite do plano.');
    }
    const existingGames = await this.prisma.game.count({ where: { id: { in: gameIds } } });
    if (existingGames !== gameIds.length) throw new NotFoundException('Um ou mais jogos não foram encontrados.');
    await this.prisma.planGame.deleteMany({ where: { planId: id } });
    if (gameIds.length) {
      await this.prisma.planGame.createMany({ data: gameIds.map((gameId) => ({ planId: id, gameId })) });
    }
    return this.games(id);
  }

  async update(id: number, name: string, price: number, maxGames: number, minDiscount: number, maxDiscount: number) {
    const current = await this.findOne(id);
    maxGames ??= current.maxGames;
    minDiscount ??= current.minDiscount;
    maxDiscount ??= current.maxDiscount;
    this.validateDiscounts(maxGames, minDiscount, maxDiscount);
    return this.prisma.plan.update({
      where: {
        id,
      },
      data: {
        name,
        price,
        maxGames,
        minDiscount,
        maxDiscount,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.plan.delete({
      where: {
        id,
      },
    });
  }

  private validateDiscounts(maxGames: number, minDiscount: number, maxDiscount: number) {
    if (maxGames < 0 || minDiscount < 0 || maxDiscount < minDiscount || maxDiscount > 100) {
      throw new BadRequestException('Limite de jogos ou faixa de desconto inválida.');
    }
  }
}