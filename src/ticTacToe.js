var Player = /** @class */ (function () {
    function Player(symbol) {
        this.symbol = symbol;
    }
    Player.prototype.takeTurn = function (board, turn) {
        if (board[turn[0]][turn[1]] != "") {
            return -1;
        }
        else {
            board[turn[0]][turn[1]] = this.symbol;
            return board;
        }
    };
    return Player;
}());
var TicTacToe = /** @class */ (function () {
    function TicTacToe(columns, rows, players) {
        this.columns = columns;
        this.rows = rows;
        this.players = players;
        this.turnIndex = 0;
        this.board = [];
        this.turnCount = 0;
        this.gameHasEnded = false;
        this.buildBoard();
    }
    TicTacToe.prototype.buildBoard = function () {
        for (var i = 0; i < this.rows; i++) {
            this.board.push([]);
            for (var j = 0; j < this.columns; j++) {
                this.board[i].push("");
            }
        }
    };
    TicTacToe.prototype.turn = function (turn) {
        var player = this.players[this.turnIndex];
        var resultOfTurn = player.takeTurn(this.board, turn);
        if (resultOfTurn != -1) {
            this.turnCount += 1;
            this.board = resultOfTurn;
            this.turnIndex++;
            if (this.turnIndex >= this.players.length) {
                this.turnIndex = 0;
            }
            if (this.checkForWin(player)) {
                this.playerHasWon(player);
                return "\"w\"".concat(player.symbol);
            }
            if (this.turnCount >= this.rows * this.columns) {
                this.gameTie();
                return "t";
            }
            return player.symbol;
        }
        return "-1";
    };
    TicTacToe.prototype.checkForWin = function (player) {
        // * note: could be improved grately with memoization / DP
        var columnsAndDiagonals = this.buildColumnMatrixAndDiagonals();
        var columnMatrix = columnsAndDiagonals[0];
        var diagonals = columnsAndDiagonals[1];
        var matchedArray = [];
        var matchedRow = this.iterateAndFind(this.board, player.symbol);
        var matchedColumn = this.iterateAndFind(columnMatrix, player.symbol);
        var matchedDiagonal = this.iterateAndFind(diagonals, player.symbol);
        matchedArray.push(matchedRow);
        matchedArray.push(matchedColumn);
        matchedArray.push(matchedDiagonal);
        var hasWon = matchedArray.find(function (subarray) { return subarray; });
        return hasWon == true;
    };
    TicTacToe.prototype.iterateAndFind = function (matrix, symbol) {
        var matchedRow = matrix.find(function (row) {
            return row.every(function (option) {
                return option == symbol;
            });
        });
        return matchedRow != undefined;
    };
    TicTacToe.prototype.buildColumnMatrixAndDiagonals = function () {
        var columnMatrix = [];
        var diagonalArray = [];
        var diagonal1 = [];
        var diagonal2 = [];
        for (var i = 0; i < this.rows; i++) {
            var column = [];
            for (var j = 0; j < this.columns; j++) {
                column.push(this.board[j][i]);
                diagonal1.push(this.board[i][i]);
                diagonal2.push(this.board[this.rows - 1 - i][this.rows - 1 - i]);
            }
            columnMatrix.push(column);
        }
        diagonalArray.push(diagonal1);
        diagonalArray.push(diagonal2);
        return [columnMatrix, diagonalArray];
    };
    TicTacToe.prototype.playerHasWon = function (player) {
        this.winner = player;
        this.finishGame();
    };
    TicTacToe.prototype.gameTie = function () {
        // todo: theres been a tie
        this.finishGame();
    };
    TicTacToe.prototype.finishGame = function () {
        this.gameHasEnded = true;
    };
    return TicTacToe;
}());
function main() {
    var status = document.querySelector(".status");
    var restart = document.querySelector(".restart");
    var board = document.querySelector(".board");
    var p1 = new Player("O");
    var p2 = new Player("X");
    var ttt = new TicTacToe(3, 3, [p1, p2]);
    var cells = [];
    var _loop_1 = function (i) {
        var _loop_2 = function (j) {
            var physical = document.createElement("button");
            cells.push(physical);
            physical.addEventListener("click", function (e) {
                return clickEvents(e, i, j, physical);
            });
            board === null || board === void 0 ? void 0 : board.appendChild(physical);
        };
        for (var j = 0; j < ttt.columns; j++) {
            _loop_2(j);
        }
    };
    for (var i = 0; i < ttt.rows; i++) {
        _loop_1(i);
    }
    function clickEvents(e, i, j, physical) {
        var text = ttt.turn([i, j]);
        if (text.includes("t")) {
            physical.textContent = text;
            status.textContent = "It is a tie!";
            physical.removeEventListener("click", function (e) { return clickEvents; });
        }
        else if (text.includes("w")) {
            var text2 = text.replace("w", "");
            console.log(text2);
            physical.textContent = text2;
            status.textContent = "Player ".concat(text2, " wins!");
            physical.removeEventListener("click", function (e) { return clickEvents; });
        }
        else if (text != "-1") {
            physical.textContent = text;
            status.textContent = "Player ".concat(ttt.players[ttt.turnIndex].symbol, " turn");
        }
    }
    restart.addEventListener("click", function (e) {
        for (var _i = 0, cells_1 = cells; _i < cells_1.length; _i++) {
            var cell = cells_1[_i];
            cell.remove();
        }
        status.textContent = "Start the game";
        // cells = [];
        // main();
    });
}
main();
