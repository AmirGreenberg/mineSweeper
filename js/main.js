'use strict'

const ROWS = 4
const COLS = 4

const SAFE = 'SAFE'
const MINE = 'MINE'
const MINE_SIGN = '💣'

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
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)
    // renderNegCount()
}

function buildBoard() {
    const board = createMat(ROWS, COLS)

    for (var i = 0; i < ROWS; i++) {
        for (var j = 0; j < COLS; j++) {
            var cell = { type: SAFE, minesNegsCount: '' }
            board[i][j] = cell
        }
    }

    board[0][0].type = MINE
    board[1][1].type = MINE

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

            strHTML += `\t<td class="cell ${cellClass}" onclick="moveTo(${i},${j})"><span class="negCount">${currCell.minesNegsCount}</span>`

            if (currCell.type === MINE) {
                strHTML += MINE_SIGN
            }
            // } else if (currCell.gameElement === BALL) {
            //     strHTML += BALL_IMG
            // }

            strHTML += '</td>\n'
        }
        strHTML += '</tr>\n'
    }
    console.table()
    elBoard.innerHTML = strHTML
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            if (currCell.type === MINE) continue
            currCell.minesNegsCount = countNegs(board, i, j)
        }
    }
    console.log('board: ', board)
    return board
}

function countNegs(board, rowIdx, colIdx) {
    var mineCount = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            if (currCell.type === MINE) mineCount++
        }
    }

    return mineCount
}
