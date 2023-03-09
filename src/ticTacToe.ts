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
  turnCount: number;
}

class TicTacToe {
  constructor(columns: number, rows: number, players: Player[]) {
    this.columns = columns;
    this.rows = rows;
    this.players = players;
    this.turnIndex = 0;
    this.board = [];
    this.turnCount = 0;
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
      this.turnCount += 1;
      this.board = resultOfTurn;
      this.turnIndex++;
      if (this.turnIndex >= this.players.length) {
        this.turnIndex = 0;
      }
      if (this.checkForWin(player)) {
        this.playerHasWon(player);
      }
      if (this.turnCount >= this.rows * this.columns) {
        this.gameTie();
      }
    }
  }
  private checkForWin(player: Player) {
    // * note: could be improved grately with memoization / DP
    const columnsAndDiagonals = this.buildColumnMatrixAndDiagonals();
    const columnMatrix = columnsAndDiagonals[0];
    const diagonals = columnsAndDiagonals[1];
    let matchedArray: boolean[] = [];
    const matchedRow = this.iterateAndFind(this.board, player.symbol);
    const matchedColumn = this.iterateAndFind(columnMatrix, player.symbol);
    const matchedDiagonal = this.iterateAndFind(diagonals, player.symbol);
    matchedArray.push(matchedRow);
    matchedArray.push(matchedColumn);
    matchedArray.push(matchedDiagonal);
    const hasWon = matchedArray.find((subarray) => subarray);
    return hasWon == true;
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
  private playerHasWon(player: Player) {
    // todo: player has won
    this.finishGame();
  }
  private gameTie() {
    // todo: theres been a tie
    this.finishGame();
  }
  private finishGame() {
    //todo: finish game
  }
}

function main() {
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
}

main();
