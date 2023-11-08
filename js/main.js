'use strict'

const SAFE = 'SAFE'
const MINE = 'MINE'
const MINE_SIGN = '💣'

var gBoard = {
    minesAroundCount: 4,
    isShown: false,
    isMine: false,
    isMarked: true,
}

var gLevel = {
    SIZE: 4,
    MINES: 2,
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
}

function initGame() {
    const elPlayAgain = document.querySelector('.play-again-container')
    elPlayAgain.classList.add('hidden')
    gBoard = buildBoard()
    setminesAroundCount(gBoard)
    renderBoard(gBoard)
}

function buildBoard() {
    const board = createMat(gLevel.SIZE, gLevel.SIZE)

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var cell = {
                minesAroundCount: '',
                isShown: false,
                isMine: false,
                isMarked: false,
            }

            board[i][j] = cell
        }
    }

    // board[0][0].isMine = true
    // board[1][1].isMine = true

    addMines(board)

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

            if (currCell.isMine) cellClass += ' mine'
            else if (!currCell.isMine) cellClass += ' safe'

            strHTML += `\t<td class="cell ${cellClass}" 
                        onclick="onCellClicked(this, ${i}, ${j})">
                        <span class="hidden negCount" >${currCell.minesAroundCount}</span>`

            if (currCell.isMine) {
                strHTML += `<span class="hidden mine" >${MINE_SIGN}</span>`
            }

            strHTML += '</td>\n'
        }
        strHTML += '</tr>\n'
    }
    console.table()
    elBoard.innerHTML = strHTML
}

function setminesAroundCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            if (currCell.isMine) continue
            currCell.minesAroundCount = countNegs(board, i, j)
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
            if (currCell.isMine) mineCount++
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
    if (!cell.isMine) {
        const gElSelectedCell = elCell.querySelector('.negCount')
        gElSelectedCell.classList.toggle('hidden')
        elCell.classList.toggle('selected')
    } else if (cell.isMine) {
        const gElSelectedCell = elCell.querySelector('.mine')
        gElSelectedCell.classList.toggle('hidden')
        elCell.classList.toggle('selected')
    }
}

function addMines(board) {
    for (var i = 0; i < gLevel.MINES; i++) {
        var idx = findEmptyCell(board)
        board[idx.i][idx.j].isMine = true
    }
}

function findEmptyCell(board) {
    var emptyCells = []

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if (!board[i][j].isMine) {
                emptyCells.push({ i, j })
            }
        }
    }
    if (emptyCells.length === 0) return null

    const idx = getRandomInt(0, emptyCells.length)
    return emptyCells.splice(idx, 1)[0]
}
