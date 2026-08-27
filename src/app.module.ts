import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ProfilesModule } from './profiles/profiles.module';
import { PlansModule } from './plan/plan.module';

@Module({
  imports: [UsersModule, ProfilesModule, PlansModule], //conectar sub modulos
  controllers: [],
  providers: [],
})
export class AppModule {}
