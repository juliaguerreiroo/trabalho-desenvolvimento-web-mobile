import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class PlansService {
  constructor(private prisma: PrismaService) {}

  async create(name: string, price: number) {
    return this.prisma.plan.create({
      data: {
        name,
        price,
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

  async update(id: number, name: string, price: number) {
    await this.findOne(id);
    return this.prisma.plan.update({
      where: {
        id,
      },
      data: {
        name,
        price,
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
}