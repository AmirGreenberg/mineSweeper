'use strict'

const SAFE = 'SAFE'
const MINE = 'MINE'
const MINE_SIGN = '💣'
const MARKED_SIGN = '🚩'

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
    setMinesAroundCount(gBoard)
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

    board[0][0].isMine = true
    board[1][1].isMine = true

    // addMines(board)

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
                        onclick="onCellClicked(this, ${i}, ${j})"
                        oncontextmenu="onCellMarked(this, ${i}, ${j})">
                        <span class="hidden negCount" >${currCell.minesAroundCount}</span>
                        <span class="hidden marked" >${MARKED_SIGN}</span>`

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

function setMinesAroundCount(board) {
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

function onCellClicked(elCell, i, j) {
    const currCell = gBoard[i][j]
    if (currCell.isShown) return
    if (currCell.isMarked) return

    if (!gGame.isOn) startGame()
    if (currCell.isMine) gameOver()

    console.log('elCell: ', elCell)

    currCell.isShown = true
    gGame.shownCount++

    renderClickedCell(elCell, i, j)
    expandShown(gBoard, elCell, i, j)
    checkGameOver()

    console.log('gGame: ', gGame)
}

function onCellMarked(elCell, i, j) {
    window.addEventListener('contextmenu', (e) => e.preventDefault())
    const currCell = gBoard[i][j]
    var diff = currCell.isMarked ? -1 : 1
    currCell.isMarked = !currCell.isMarked
    gGame.markedCount += diff

    renderMarkedCell(elCell, i, j)

    console.log('elCell: ', currCell)
    console.log('gGame: ', gGame)

    checkGameOver()
}

function renderClickedCell(elCell, i, j) {
    const currCell = gBoard[i][j]
    if (!currCell.isMine) {
        const gElSelectedCell = elCell.querySelector('.negCount')
        gElSelectedCell.classList.remove('hidden')
        elCell.classList.add('selected')
    } else if (currCell.isMine) {
        const gElSelectedCell = elCell.querySelector('.mine')
        gElSelectedCell.classList.remove('hidden')
        elCell.classList.add('selected')
    }
}

function renderMarkedCell(elCell, i, j) {
    const gElSelectedCell = elCell.querySelector('.marked')
    gElSelectedCell.classList.toggle('hidden')
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

function checkGameOver() {
    console.log('checkGameOver')
}

function expandShown(board, elCell, rowIdx, colIdx) {
    var negsCount = countNegs(board, rowIdx, colIdx)
    if (negsCount) return

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            if (currCell.isMine) continue
            if (!currCell.isShown && !currCell.isMarked) {
                currCell.isShown = true
                gGame.shownCount++
                var cellClass = '.' + getClassName({ i, j })
                var elCell = document.querySelector(cellClass)
                renderClickedCell(elCell, i, j)
            }
        }
    }
}

function startGame() {
    gGame.isOn = true
}

function gameOver() {
    gGame.isOn = false
    console.log('gameOver')
}
