import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { PlansService } from './plan.service';

@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Post()
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  create(
    @Body('name') name: string,
    @Body('price') price: number,
    @Body('maxGames') maxGames: number,
    @Body('minDiscount') minDiscount: number,
    @Body('maxDiscount') maxDiscount: number,
  ) {
    return this.plansService.create(name, price, maxGames, minDiscount, maxDiscount);
  }

  @Get()
  findAll() {
    return this.plansService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.plansService.findOne(id);
  }

  @Get('me/games')
  myGames(@Req() request: { user: { sub: number } }) {
    return this.plansService.userGames(request.user.sub);
  }

  @Post(':id/subscribe')
  subscribe(@Req() request: { user: { sub: number } }, @Param('id', ParseIntPipe) id: number) {
    return this.plansService.subscribe(request.user.sub, id);
  }

  @Get(':id/games')
  games(@Param('id', ParseIntPipe) id: number) {
    return this.plansService.games(id);
  }

  @Put(':id/games')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  setGames(@Param('id', ParseIntPipe) id: number, @Body('gameIds') gameIds: number[]) {
    return this.plansService.setGames(id, gameIds ?? []);
  }

  @Put(':id')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body('name') name: string,
    @Body('price') price: number,
    @Body('maxGames') maxGames: number,
    @Body('minDiscount') minDiscount: number,
    @Body('maxDiscount') maxDiscount: number,
  ) {
    return this.plansService.update(id, name, price, maxGames, minDiscount, maxDiscount);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.plansService.remove(id);
  }
}