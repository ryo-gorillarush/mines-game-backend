export interface GridItem {
  id: string;
  isMine: boolean;
  isRevealed: boolean;
}

export interface GameResponse {
  gridTable: GridItem[][];
  gameStarted: boolean;
  betAmount: number;
  mineCount: number;
  gridSize: number;
  unrevealedCount: number;
  currentMultiply: number;
  nextMultiply: number;
}

export interface RevealedGridItemResponse {
  gridItem: GridItem;
  gameStarted: boolean;
  unrevealedCount: number;
  currentMultiply: number;
  nextMultiply: number;
}

export interface RevealedResultResponse {
  resultTable: GridItem[][];
  gameStarted: boolean;
  betAmount: number;
  totalWinningAmount: number;
  unrevealedCount: number;
  currentMultiply: number;
}