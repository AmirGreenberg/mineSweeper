'use strict'

const ROWS = 4
const COLS = 4

const SAFE = 'SAFE'
const MINE = 'MINE'
const MINE_SIGN = '💣'

var gBoard

function initGame() {
    const elPlayAgain = document.querySelector('.play-again-container')
    elPlayAgain.classList.add('hidden')
    gBoard = buildBoard()
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)
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

            strHTML += `\t<td class="cell ${cellClass}" 
                        onclick="onCellClicked(this, ${i}, ${j})">
                        <span class="hidden negCount" >${currCell.minesNegsCount}</span>`

            if (currCell.type === MINE) {
                strHTML += `<span class="hidden mine" >${MINE_SIGN}</span>`
            }

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
            if (currCell.type === MINE) currCell.minesNegsCount = MINE
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

function onCellClicked(elCell, i, j) {
    console.log('elCell: ', elCell)
    const cell = gBoard[i][j]
    toggleEl(elCell, i, j)
}

function toggleEl(elCell, i, j) {
    const cell = gBoard[i][j]
    if (cell.type === SAFE) {
        const gElSelectedCell = elCell.querySelector('.negCount')
        gElSelectedCell.classList.toggle('hidden')
        elCell.classList.toggle('selected')

    } else if (cell.type === MINE) {
        const gElSelectedCell = elCell.querySelector('.mine')
        gElSelectedCell.classList.toggle('hidden')
        elCell.classList.toggle('selected')
    }
}
