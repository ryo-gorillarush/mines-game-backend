import { Module } from '@nestjs/common';
import { GameController } from './game/game.controller';
import { GameService } from './game/game.service';

@Module({
  imports: [],
  controllers: [GameController],
  providers: [GameService],
})
export class AppModule {}
