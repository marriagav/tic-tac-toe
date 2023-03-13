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
  gameHasEnded: boolean;
  winner: Player;
}

class TicTacToe {
  constructor(columns: number, rows: number, players: Player[]) {
    this.columns = columns;
    this.rows = rows;
    this.players = players;
    this.turnIndex = 0;
    this.board = [];
    this.turnCount = 0;
    this.gameHasEnded = false;
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
    const resultOfTurn = player.takeTurn(this.board, turn);
    if (resultOfTurn != -1) {
      this.turnCount += 1;
      this.board = resultOfTurn;
      this.turnIndex++;
      if (this.turnIndex >= this.players.length) {
        this.turnIndex = 0;
      }
      if (this.checkForWin(player)) {
        this.playerHasWon(player);
        return `w${player.symbol}`;
      }
      if (this.turnCount >= this.rows * this.columns) {
        this.gameTie();
        return `t${player.symbol}`;
      }
      return player.symbol;
    }
    return "-1";
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
      }
      diagonal1.push(this.board[i][i]);
      diagonal2.push(this.board[this.rows - 1 - i][i]);
      columnMatrix.push(column);
    }
    diagonalArray.push(diagonal1);
    diagonalArray.push(diagonal2);
    return [columnMatrix, diagonalArray];
  }
  private playerHasWon(player: Player) {
    this.winner = player;
    this.finishGame();
  }
  private gameTie() {
    this.finishGame();
  }
  private finishGame() {
    this.gameHasEnded = true;
  }
}

function main() {
  const status = document.querySelector(".status");
  const restart = document.querySelector(".restart");
  const board = document.querySelector(".board");
  let p1 = new Player("O");
  let p2 = new Player("X");
  let ttt = new TicTacToe(3, 3, [p1, p2]);

  let cells: Element[] = [];

  for (let i = 0; i < ttt.rows; i++) {
    for (let j = 0; j < ttt.columns; j++) {
      const physical = document.createElement("button");
      cells.push(physical);
      physical.addEventListener("click", (e: Event) =>
        clickEvents(e, i, j, physical)
      );
      board?.appendChild(physical);
    }
  }

  function clickEvents(e: Event, i: number, j: number, physical: Element) {
    if (ttt.winner != null) {
      return;
    }
    const text = ttt.turn([i, j]);
    if (text.includes("t")) {
      const text2 = text.replace("t", "");
      physical.textContent = text2;
      status.textContent = "It is a tie!";
    } else if (text.includes("w")) {
      const text2 = text.replace("w", "");
      console.log(text2);
      physical.textContent = text2;
      status.textContent = `Player ${text2} wins!`;
    } else if (text != "-1") {
      physical.textContent = text;
      status.textContent = `Player ${ttt.players[ttt.turnIndex].symbol} turn`;
    }
  }

  restart.addEventListener("click", (e) => {
    for (const cell of cells) {
      cell.textContent = "";
    }
    status.textContent = "Start the game";
    p1 = new Player("O");
    p2 = new Player("X");
    ttt = new TicTacToe(3, 3, [p1, p2]);
  });
}

main();
