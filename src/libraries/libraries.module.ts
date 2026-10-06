import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { LibrariesController } from './libraries.controller';
import { LibrariesService } from './libraries.service';

@Module({
  controllers: [LibrariesController],
  providers: [LibrariesService, PrismaService],
})
export class LibrariesModule {}
