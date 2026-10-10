import { Module } from '@nestjs/common';
import { PlansController } from './plan.controller';
import { PlansService } from './plan.service';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [PlansController],
  providers: [PlansService, PrismaService],
})
export class PlansModule {}