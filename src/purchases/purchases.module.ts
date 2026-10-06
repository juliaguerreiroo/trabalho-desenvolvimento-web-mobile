import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { PurchasesController } from './purchases.controller';
import { PurchasesService } from './purchases.service';

@Module({
  controllers: [PurchasesController],
  providers: [PurchasesService, PrismaService],
})
export class PurchasesModule {}
