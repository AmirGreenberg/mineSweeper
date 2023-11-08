'use strict'

const ROWS = 4
const COLS = 4

const SAFE = 'SAFE'
const MINE = 'MINE'
const MINE_IMG = '<img src="img/cherry.png">'

var gBoard
// var gGamerPos

// var gGlueInterval
// var isStuck
// var gBallsInterval
// var gCollectedBalls
// var gBallsCount
// var gIsGameOver
// var gIsFirstMove
// var gEatSound = new Audio('sounds/eat.mp3')

function initGame() {
    const elPlayAgain = document.querySelector('.play-again-container')
    elPlayAgain.classList.add('hidden')
    // gGamerPos = { i: 2, j: 9 }
    // gCollectedBalls = 0
    // gBallsCount = 0
    // renderBallsCount()
    // gIsGameOver = false
    gBoard = buildBoard()
    renderBoard(gBoard)
    // renderNegCount()
}

function buildBoard() {
    const board = createMat(ROWS, COLS)
    console.log('board: ', board)

    for (var i = 0; i < ROWS; i++) {
        for (var j = 0; j < COLS; j++) {
            var cell = { type: SAFE, minesNegsCount: 0 }
            board[i][j] = cell
        }
    }

    board[0][0].type = MINE
    board[1][1].type = MINE

    console.log('board: ', board)
    console.table(board)
    return board
}

function renderBoard(board) {
    var strHTML = ''
    const elBoard = document.querySelector('.board')

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[0].length; j++) {
            const currCell = board[i][j]
            var cellClass = getClassName({ i, j })

            if (currCell.type === MINE) cellClass += ' mine'
            else if (currCell.type === SAFE) cellClass += ' safe'

            strHTML += `\t<td class="cell ${cellClass}" onclick="moveTo(${i},${j})">`

            // if (currCell.type === MINE) {
            //     strHTML += MINE_IMG
            // } else if (currCell.gameElement === BALL) {
            //     strHTML += BALL_IMG
            // }

            strHTML += '</td>\n'
        }
        strHTML += '</tr>\n'
    }
    console.log('strHTML: ', strHTML)
    console.table()
    elBoard.innerHTML = strHTML
}
