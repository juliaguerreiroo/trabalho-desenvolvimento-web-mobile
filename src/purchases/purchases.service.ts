import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreatePurchaseDto } from 'src/dtos/create-purchase-dto';

@Injectable()
export class PurchasesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, dto: CreatePurchaseDto) {
    if (!dto.items.length) {
      throw new BadRequestException('A compra deve conter pelo menos um jogo.');
    }

    const gameIds = dto.items.map((item) => item.gameId);
    if (new Set(gameIds).size !== gameIds.length) {
      throw new BadRequestException('Não é possível repetir jogos na mesma compra.');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
    if (!user) throw new NotFoundException('Usuário não encontrado.');

    const games = await this.prisma.game.findMany({ where: { id: { in: gameIds } } });
    if (games.length !== gameIds.length) {
      throw new NotFoundException('Um ou mais jogos não foram encontrados.');
    }

    const activePlans = await this.prisma.planSubscription.findMany({
      where: { userId, expiresAt: { gt: new Date() } },
      include: { plan: { include: { games: true } } },
    });

    return this.prisma.$transaction(async (transaction) => {
      const purchaseItems = await Promise.all(
        dto.items.map(async (item) => {
          const game = games.find((entry) => entry.id === item.gameId)!;
          const planDiscount = this.resolvePlanDiscount(activePlans, game.id);
          const effectiveDiscount = Math.max(game.currentDiscount, planDiscount);

          return {
            gameId: game.id,
            acquisitionPrice: game.price,
            discount: Number((game.price - this.netPrice(game.price, effectiveDiscount)).toFixed(2)),
          };
        }),
      );

      const purchase = await transaction.purchase.create({
        data: {
          userId,
          totalPrice: purchaseItems.reduce((total, item) => total + this.netPrice(item.acquisitionPrice, this.discountPercent(item.acquisitionPrice, item.discount)), 0),
          purchases: {
            create: purchaseItems,
          },
        },
        include: { purchases: { include: { game: true } } },
      });

      for (const game of games) {
        const library = await transaction.library.upsert({
          where: { userId },
          create: { userId },
          update: {},
        });
        await transaction.gamesOnLibrary.upsert({
          where: { libraryId_gameId: { libraryId: library.id, gameId: game.id } },
          create: { libraryId: library.id, gameId: game.id, timePlayed: 0 },
          update: {},
        });
      }
      return purchase;
    });
  }

  private resolvePlanDiscount(activePlans: Array<{ plan: { minDiscount: number; maxDiscount: number; games: Array<{ gameId: number }> } }>, gameId: number) {
    const current = activePlans.find((subscription) =>
      subscription.plan.games.some((entry) => entry.gameId === gameId),
    );
    if (!current) return 0;
    const min = current.plan.minDiscount;
    const max = current.plan.maxDiscount;
    const chance = min + Math.random() * (max - min);
    return Number(Math.min(max, chance).toFixed(2));
  }

  private netPrice(price: number, discountPercent: number) {
    return Number((price * (1 - discountPercent / 100)).toFixed(2));
  }

  private discountPercent(price: number, discountAmount: number) {
    if (price <= 0) return 0;
    return Number(((discountAmount / price) * 100).toFixed(2));
  }

  findAll(userId: number) {
    return this.prisma.purchase.findMany({
      where: { userId },
      include: { purchases: { include: { game: true } } },
      orderBy: { data: 'desc' },
    });
  }

  async findOne(userId: number, id: number) {
    const purchase = await this.prisma.purchase.findUnique({
      where: { id, userId },
      include: { purchases: { include: { game: true } } },
    });
    if (!purchase) throw new NotFoundException('Compra não encontrada.');
    return purchase;
  }

  async remove(userId: number, id: number) {
    await this.findOne(userId, id);
    return this.prisma.purchase.delete({ where: { id } });
  }
}
