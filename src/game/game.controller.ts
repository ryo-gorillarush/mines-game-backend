import { Controller, Post, Body, Get } from '@nestjs/common';
import { GameService } from './game.service';
import type { GameResponse, GridItem, RevealedGridItemResponse, RevealedResultResponse } from './grid-item.interface';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {
  }

  @Get('check-connection')
  checkConnection(): string {
    return 'Backend server is running and connection is successful.';
  }

  @Post('create-template')
  createTemplate(@Body() body: { gridSize: number }): GridItem[][] {
    const { gridSize } = body;
    return this.gameService.createGrid(gridSize, false);
  }

  @Post('start-game')
  startGame(@Body() body: { betAmount: number; gridSize: number; mineCount: number }): GameResponse {
    const { betAmount, mineCount, gridSize } = body;
    return this.gameService.initializeGame(betAmount, gridSize, mineCount);
  }

  @Post('reveal')
  reveal(@Body() body: { id: string }): RevealedGridItemResponse | null {
    const { id } = body;
    return this.gameService.revealGridItem(id);
  }

  @Get('reveal-result')
  revealResult(): RevealedResultResponse {
    return this.gameService.getGameResult();
  }
}
