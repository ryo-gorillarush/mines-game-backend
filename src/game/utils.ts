import type { GridItem } from './grid-item.interface';

export function placeMines(grid: GridItem[][], mineCount: number): GridItem[][] {
  const rows = grid.length;
  const cols = grid[0].length;
  const totalCells = rows * cols;

  if (mineCount <= 0 || mineCount >= totalCells) {
    throw new Error(`Invalid mine count. Must be between 0 and ${totalCells - 1}.`);
  }

  const updatedGrid: GridItem[][] = grid.map(row =>
    row.map(cell => ({ ...cell, isMine: false })),
  );

  const minePositions = new Set<number>();
  while (minePositions.size < mineCount) {
    minePositions.add(Math.floor(Math.random() * totalCells));
  }

  for (const position of minePositions) {
    const row = Math.floor(position / cols);
    const col = position % cols;
    updatedGrid[row][col].isMine = true;
  }

  return updatedGrid;
}