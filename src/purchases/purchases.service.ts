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

    const calculatedTotal = dto.items.reduce((total, item) => {
      if (item.discount > item.acquisitionPrice) {
        throw new BadRequestException('O desconto não pode ser maior que o preço do jogo.');
      }
      return total + item.acquisitionPrice - item.discount;
    }, 0);
    if (Math.abs(calculatedTotal - dto.totalPrice) > 0.01) {
      throw new BadRequestException('O total da compra não corresponde aos itens.');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
    if (!user) throw new NotFoundException('Usuário não encontrado.');

    const games = await this.prisma.game.findMany({ where: { id: { in: gameIds } }, select: { id: true } });
    if (games.length !== gameIds.length) {
      throw new NotFoundException('Um ou mais jogos não foram encontrados.');
    }

    return this.prisma.$transaction(async (transaction) => {
      const purchase = await transaction.purchase.create({
        data: {
          userId,
          totalPrice: dto.totalPrice,
          purchases: {
            create: dto.items.map((item) => ({
              gameId: item.gameId,
              acquisitionPrice: item.acquisitionPrice,
              discount: item.discount,
            })),
          },
        },
        include: { purchases: { include: { game: true } } },
      });
      return purchase;
    });
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
