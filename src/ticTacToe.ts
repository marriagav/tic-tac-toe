interface Player {
  symbol: string;
}

class Player {
  constructor(symbol: string) {
    this.symbol = symbol;
  }
  takeTurn(board: string[][], turn: number[]) {
    if (board[turn[0]][turn[1]] != "") {
      return -1;
    } else {
      board[turn[0]][turn[1]] = this.symbol;
      return board;
    }
  }
}

interface TicTacToe {
  columns: number;
  rows: number;
  players: Player[];
  turnIndex: number;
  board: string[][];
}

class TicTacToe {
  constructor(columns: number, rows: number, players: Player[]) {
    this.columns = columns;
    this.rows = rows;
    this.players = players;
    this.turnIndex = 0;
    this.board = [];
    this.buildBoard();
  }
  buildBoard() {
    for (let i = 0; i < this.rows; i++) {
      this.board.push([]);
      for (let j = 0; j < this.columns; j++) {
        this.board[i].push("");
      }
    }
  }
  turn(turn: number[]) {
    const player = this.players[this.turnIndex];
    const resultOfTurn = this.players[this.turnIndex].takeTurn(
      this.board,
      turn
    );
    if (resultOfTurn != -1) {
      this.board = resultOfTurn;
      this.turnIndex++;
      if (this.turnIndex >= this.players.length) {
        this.turnIndex = 0;
      }
      this.checkForWin(player);
    }
  }
  private checkForWin(player: Player) {
    const columnsAndDiagonals = this.buildColumnMatrixAndDiagonals();
    const columnMatrix = columnsAndDiagonals[0];
    const diagonals = columnsAndDiagonals[1];
    const matchedRow = this.iterateAndFind(this.board, player.symbol);
    const matchedColumn = this.iterateAndFind(columnMatrix, player.symbol);
    const matchedDiagonal = this.iterateAndFind(diagonals, player.symbol);
    console.log(matchedRow);
    console.log(matchedColumn);
    console.log(matchedDiagonal);
  }
  private iterateAndFind(matrix: string[][], symbol: string) {
    const matchedRow = matrix.find((row) => {
      return row.every((option) => {
        return option == symbol;
      });
    });
    return matchedRow != undefined;
  }
  private buildColumnMatrixAndDiagonals(): [string[][], string[][]] {
    let columnMatrix: string[][] = [];
    let diagonalArray: string[][] = [];
    let diagonal1: string[] = [];
    let diagonal2: string[] = [];
    for (let i = 0; i < this.rows; i++) {
      let column: string[] = [];
      for (let j = 0; j < this.columns; j++) {
        column.push(this.board[j][i]);
        diagonal1.push(this.board[i][i]);
        diagonal2.push(this.board[this.rows - 1 - i][this.rows - 1 - i]);
      }
      columnMatrix.push(column);
    }
    diagonalArray.push(diagonal1);
    diagonalArray.push(diagonal2);
    return [columnMatrix, diagonalArray];
  }
}

const p1 = new Player("o");
const p2 = new Player("x");
const ttt = new TicTacToe(3, 3, [p1, p2]);
ttt.turn([0, 0]);
ttt.turn([1, 0]);
ttt.turn([1, 1]);
ttt.turn([1, 2]);
ttt.turn([2, 2]);
console.log(ttt.board);
// ttt.turn([0, 0]);
// console.log(ttt.board);
// ttt.turn([1, 1]);
// console.log(ttt.board);
// ttt.turn([0, 1]);
// console.log(ttt.board);
