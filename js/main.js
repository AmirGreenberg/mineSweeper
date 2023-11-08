'use strict'

const SAFE = 'SAFE'
const MINE = 'MINE'
const MINE_SIGN = '💣'
const MARKED_SIGN = '🚩'

var gLevel = {
    ROWS: 4,
    COLS: 4,
    MINES: 2,
}

var gLevelNExtGame
var gBoard
var gGame
var gStartTime
var gInterval
var gShownTarget

function initGame() {
    resetVars()
    gBoard = buildBoard()
    setMinesAroundCount(gBoard)
    renderBoard(gBoard)
    renderScoreBoard()
}

function resetVars() {
    clearInterval(gInterval)
    gStartTime = null
    document.querySelector('.timer').innerText = null
    gShownTarget = gLevel.COLS * gLevel.ROWS - gLevel.MINES

    gBoard = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
    }

    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        mineCount: 0,
    }
}

function buildBoard() {
    var board = createMat(gLevel.ROWS, gLevel.COLS)

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
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
    board[0][1].isMine = true

    // addMines(board)

    console.table(board)
    return board
}

function renderBoard(board) {
    var strHTML = ''
    const elBoard = document.querySelector('.board')

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[i].length; j++) {
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
        for (var j = 0; j < board[i].length; j++) {
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

    if (!gGame.isOn) startTime()
    if (currCell.isMine) {
        renderClickedCell(elCell, i, j)
        loseGame(gGame, elCell, i, j)
    }

    console.log('elCell: ', elCell)

    currCell.isShown = true
    gGame.shownCount++

    renderClickedCell(elCell, i, j)
    expandShown(gBoard, elCell, i, j)
    if (checkifWin()) winGame(gGame, elCell, i, j)

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

    if (checkifWin()) gameOver(elCell, i, j)
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
        if (gGame.mineCount === 0) elCell.classList.add('selected')
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

function checkifWin() {
    renderScoreBoard()

    if (gGame.shownCount === gShownTarget && gGame.markedCount === gLevel.MINES)
        winGame()

    console.log('checkGameOver')
}

function expandShown(board, elCell, rowIdx, colIdx) {
    var negsCount = countNegs(board, rowIdx, colIdx)
    if (negsCount) return

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[i].length) continue
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

function startTime() {
    gGame.isOn = true
    startTimer()
}

function gameOver() {
    gGame.isOn = false
    console.log('gameOver')
    stopTimer()
}

function winGame() {
    console.log('You won ')
    gameOver()
}

function loseGame(board, elCell, rowIdx, colIdx) {
    console.log('You lost ')
    gameOver()
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (i === rowIdx && j === colIdx) continue
            var currCell = board[i][j]
            if (currCell.isShown) continue
            if (!currCell.isShown && currCell.isMine) {
                currCell.isShown = true
                var cellClass = '.' + getClassName({ i, j })
                var elCell = document.querySelector(cellClass)
                gGame.mineCount++
                console.log('gGame.shownCount++: ', gGame.shownCount++)

                renderClickedCell(elCell, i, j)
            }
        }
    }
}

function levelModal(toDO) {
    const elLevel = document.querySelector('.level-modal')
    console.log('elLevel: ', elLevel)
    console.log('elLevel.classList: ', elLevel.classList)

    switch (toDO) {
        case 'close':
            elLevel.classList.add('hidden')
            break

        case 'open':
            elLevel.classList.remove('hidden')
            break

        case 'toggle':
            elLevel.classList.toggle('hidden')
            break

        default:
            elLevel.classList.toggle('hidden')
    }
}

function chooseLevel(elLevel) {
    var elLevels = document.querySelector('.level-modal')
    console.log('elLevels: ', elLevels)

    elLevel.classList.add('clicked')
    console.log('elLevel.dataset.level: ', elLevel.dataset.level)

    switch (elLevel.dataset.level) {
        case 'beginner':
            gLevelNExtGame = {
                ROWS: 4,
                COLS: 4,
                MINES: 2,
            }
            break

        case 'medium':
            gLevelNExtGame = {
                ROWS: 8,
                COLS: 8,
                MINES: 2, //14
            }
            break

        case 'expert':
            gLevelNExtGame = {
                ROWS: 12,
                COLS: 12,
                MINES: 2, //32
            }
            break

        default:
            gLevelNExtGame = {
                ROWS: 4,
                COLS: 4,
                MINES: 2,
            }
    }
}

function startNewGame() {
    if (gLevelNExtGame) {
        gLevel = gLevelNExtGame
        gLevelNExtGame = 0
    }
    levelModal('close')
    initGame()
}

function renderScoreBoard() {
    document.querySelector('.mines-counter').innerText = gGame.shownCount

    document.querySelector('.strikes-counter').innerText =
        gShownTarget - gGame.shownCount

    document.querySelector('.marks-counter').innerText =
        gLevel.MINES - gGame.markedCount
}
