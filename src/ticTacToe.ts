interface Player {
  symbol: string;
}

class Player {
  constructor(symbol: string) {
    this.symbol = symbol;
  }
  takeTurn() {}
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
        this.board[i].push(".");
      }
    }
  }
  turn() {
    this.players[this.turnIndex].takeTurn();
  }
}

const p1 = new Player("o");
const p2 = new Player("x");
const ttt = new TicTacToe(3, 3, [p1, p2]);
