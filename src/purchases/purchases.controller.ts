import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Req } from '@nestjs/common';
import { CreatePurchaseDto } from 'src/dtos/create-purchase-dto';
import { PurchasesService } from './purchases.service';

@Controller('purchases')
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Post()
  create(@Req() request: { user: { sub: number } }, @Body() dto: CreatePurchaseDto) {
    return this.purchasesService.create(request.user.sub, dto);
  }

  @Get()
  findAll(@Req() request: { user: { sub: number } }) {
    return this.purchasesService.findAll(request.user.sub);
  }

  @Get(':id')
  findOne(@Req() request: { user: { sub: number } }, @Param('id', ParseIntPipe) id: number) {
    return this.purchasesService.findOne(request.user.sub, id);
  }

  @Delete(':id')
  remove(@Req() request: { user: { sub: number } }, @Param('id', ParseIntPipe) id: number) {
    return this.purchasesService.remove(request.user.sub, id);
  }
}
