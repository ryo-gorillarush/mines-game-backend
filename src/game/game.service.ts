import { BadRequestException, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { placeMines } from './utils';
import { multiplier5x5Table } from '../multipliers/5x5-multiplier';
import type {
  GameResponse,
  GridItem,
  RevealedGridItemResponse,
  RevealedResultResponse,
} from './grid-item.interface';

@Injectable()
export class GameService {
  private gridTable: GridItem[][] = [];
  private minesMap: GridItem[][] = [];
  private gameStarted = false;
  private betAmount = 1;
  private mineCount = 0;
  private gridSize = 5;
  private unrevealedCount = 0;
  private currentMultiply = 1;
  private nextMultiply = 1;
  private appliedMultiplier: number[] = [];


  createGrid(gridSize: number, useUuid: boolean = false): GridItem[][] {
    return Array.from({ length: gridSize }, (_, row) =>
      Array.from({ length: gridSize }, (_, col) => ({
        id: useUuid ? uuidv4() : `${row}-${col}`,
        isMine: false,
        isRevealed: false,
      })),
    );
  }

  initializeGame(betAmount: number, gridSize: number, mineCount: number): GameResponse {
    if (betAmount <= 0) {
      throw new BadRequestException('Bet amount must be greater than 0.');
    }

    if (gridSize < 2 || gridSize > 10) {
      throw new BadRequestException('Grid size must be between 2 and 10.');
    }

    const totalCells = gridSize * gridSize;
    if (mineCount < 0 || mineCount >= totalCells) {
      throw new BadRequestException(`Mine count must be between 0 and ${totalCells - 1}.`);
    }
    this.appliedMultiplier = multiplier5x5Table[mineCount - 1];

    this.gameStarted = true;
    this.betAmount = betAmount;
    this.gridSize = gridSize;
    this.mineCount = mineCount;
    this.unrevealedCount = totalCells - mineCount;
    this.currentMultiply = 1;
    this.nextMultiply = this.appliedMultiplier[0];

    this.gridTable = this.createGrid(this.gridSize, true);
    this.minesMap = placeMines(this.gridTable, this.mineCount);
    return {
      gridTable: this.gridTable,
      gameStarted: this.gameStarted,
      betAmount: this.betAmount,
      mineCount: this.mineCount,
      gridSize: this.gridSize,
      unrevealedCount: this.unrevealedCount,
      currentMultiply: this.currentMultiply,
      nextMultiply: this.nextMultiply,
    };
  }

  revealGridItem(id: string): RevealedGridItemResponse | null {
    const foundGridItem = this.minesMap.flat().find((item) => item.id === id);

    if (!foundGridItem || foundGridItem.isRevealed) return null;


    foundGridItem.isRevealed = true;
    this.gridTable = this.gridTable.map(row =>
      row.map(item => item.id === foundGridItem.id ? { ...foundGridItem } : item),
    );

    this.unrevealedCount--;
    const revealedCount = this.gridSize * this.gridSize - this.unrevealedCount - this.mineCount;
    this.currentMultiply = this.nextMultiply;
    this.nextMultiply = this.appliedMultiplier[revealedCount] || this.appliedMultiplier[this.appliedMultiplier.length - 1];

    return {
      gridItem: foundGridItem,
      gameStarted: this.gameStarted,
      unrevealedCount: this.unrevealedCount,
      currentMultiply: this.currentMultiply,
      nextMultiply: this.nextMultiply,
    };
  }

  getGameResult(): RevealedResultResponse {
    const resultTable = this.getMinesResult();
    const totalWinningAmount = this.calculateTotalWinningAmount();

    this.gameStarted = false;

    return {
      resultTable,
      gameStarted: this.gameStarted,
      betAmount: this.betAmount,
      totalWinningAmount,
      unrevealedCount: this.unrevealedCount,
      currentMultiply: this.currentMultiply,
    };
  }

  private getMinesResult(): GridItem[][] {
    return this.gridTable.map((row, rowIndex) =>
      row.map((item, colIndex) => ({
        id: item.id,
        isMine: this.minesMap[rowIndex][colIndex].isMine,
        isRevealed: item.isRevealed,
      })),
    );
  }

  private calculateTotalWinningAmount(): number {
    const hasPlayerWon = this.gridTable.every(
      (row, rowIndex) =>
        row.every(
          (item, colIndex) =>
            item.isRevealed === this.minesMap[rowIndex][colIndex].isMine,
        ),
    );

    return hasPlayerWon ? this.betAmount * this.currentMultiply : 0;
  }
}
