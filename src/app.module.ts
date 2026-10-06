import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ProfilesModule } from './profiles/profiles.module';
import { PlansModule } from './plan/plan.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { GamesModule } from './games/games.module';
import { LibrariesModule } from './libraries/libraries.module';
import { PurchasesModule } from './purchases/purchases.module';
import { ConfigModule } from 'node_modules/@nestjs/config/dist/config.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    ProfilesModule,
    PlansModule,
    AuthModule,
    CategoriesModule,
    GamesModule,
    LibrariesModule,
    PurchasesModule,
  ], //conectar sub modulos
  controllers: [],
  providers: [],
})
export class AppModule {}
