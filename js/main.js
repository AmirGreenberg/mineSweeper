'use strict'

const SAFE = 'SAFE'
const MINE = 'MINE'
const MINE_SIGN = '💣'
const MARKED_SIGN = '🚩'
const NORMAL_SIGN = 'New Game 😃'
const LOSE_SIGN = 'New Game 🤯'
const WIN_SIGN = 'New Game 😎'

var gLevel = {
    ROWS: 4,
    COLS: 4,
    MINES: 3,
}

var gLevelNExtGame
var gBoard
var gGame
var gStartTime
var gInterval
var gShownTarget
var gIsDarkMode = false
var gHint = {}

function initGame() {
    resetVars()
    gBoard = buildBoard()
    setMinesAroundCount(gBoard)
    renderBoard(gBoard)
    renderScoreBoard()
}

function resetVars() {
    clearInterval(gInterval)
    renderHints()
    gStartTime = null
    document.querySelector('.timer').innerText = null
    document.querySelector('.smiley').innerText = NORMAL_SIGN
    gShownTarget = gLevel.COLS * gLevel.ROWS - gLevel.MINES
    gHint = { isOn: false, elHint: null }

    gBoard = {
        minesAroundCount: '',
        isShown: false,
        isMine: false,
        isMarked: false,
    }

    gGame = {
        isOn: false,
        isFirstMove: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        mineCount: 0,
        lives: 3,
        hints: 3,
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

    // board[0][0].isMine = true
    // board[1][1].isMine = true
    // board[2][2].isMine = true

    addMines(board)

    return board
}

function setMinesAroundCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            var currCell = board[i][j]
            if (currCell.isMine) continue
            currCell.minesAroundCount = countNegs(board, i, j)
            if (!currCell.minesAroundCount) currCell.minesAroundCount = ''
        }
    }
    return board
}

function onCellClicked(elCell, i, j) {
    const currCell = gBoard[i][j]
    if (currCell.isShown) return
    if (currCell.isMarked) return
    if (!gGame.isOn && !gGame.isFirstMove) return

    if (gHint.isOn) {
        renderClickedCell(elCell, i, j)
        gGame.hints--
        return
    }
    if (gGame.isFirstMove) {
        startTimer()
        gGame.isFirstMove = false
        gGame.isOn = true
    }

    if (currCell.isMine) {
        renderClickedCell(elCell, i, j)
        gGame.lives--
        renderScoreBoard()
        if (!gGame.lives) loseGame(gBoard, elCell, i, j)
        return
    }

    currCell.isShown = true
    gGame.shownCount++

    renderClickedCell(elCell, i, j)
    renderScoreBoard()

    if (checkifWin()) winGame(gGame, elCell, i, j)

    expandShown(gBoard, elCell, i, j)
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
                renderScoreBoard()
                expandShown(board, elCell, i, j)
            }
        }
    }
}

function onCellMarked(elCell, i, j) {
    window.addEventListener('contextmenu', (e) => e.preventDefault())
    const currCell = gBoard[i][j]
    var diff = currCell.isMarked ? -1 : 1
    currCell.isMarked = !currCell.isMarked
    gGame.markedCount += diff

    renderMarkedCell(elCell, i, j)
    renderScoreBoard()

    if (checkifWin()) gameOver(elCell, i, j)
}

function addMines(board) {
    for (var i = 0; i < gLevel.MINES; i++) {
        var idx = findEmptyCell(board)
        board[idx.i][idx.j].isMine = true
    }
}

function checkifWin() {
    if (gGame.shownCount === gShownTarget && gGame.markedCount === gLevel.MINES)
        winGame()
}

function gameOver() {
    gGame.isOn = false
    stopTimer()
}

function winGame() {
    const elBoard = document.querySelector('.result')
    elBoard.innerText = 'You Won 🥳!'
    const gElCell = document.querySelector('.play-again-container')
    gElCell.classList.remove('hidden')
    document.querySelector('.smiley').innerText = WIN_SIGN
    gameOver()
}

function loseGame(board, elCell, rowIdx, colIdx) {
    const elBoard = document.querySelector('.result')
    elBoard.innerText = 'You Lost 😔'
    const gElCell = document.querySelector('.play-again-container')
    gElCell.classList.remove('hidden')
    document.querySelector('.smiley').innerText = LOSE_SIGN

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

                renderClickedCell(elCell, i, j)
            }
        }
    }
    gameOver()
}

function chooseLevel(elLevel) {
    removeLevelClass(elLevel)

    switch (elLevel.dataset.level) {
        case 'beginner':
            gLevelNExtGame = {
                ROWS: 4,
                COLS: 4,
                MINES: 3,
            }
            break

        case 'medium':
            gLevelNExtGame = {
                ROWS: 8,
                COLS: 8,
                MINES: 14, //14
            }
            break

        case 'expert':
            gLevelNExtGame = {
                ROWS: 12,
                COLS: 12,
                MINES: 32, //32
            }
            break

        default:
            gLevelNExtGame = {
                ROWS: 4,
                COLS: 4,
                MINES: 3,
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

function onHint(elHint) {
    if (!gGame.isOn || (gHint.isOn && gHint.elHint !== elHint)) return

    // if (gHint.isOn) {
    //     gHint.isOn = false
    //     gHint.elHint = null
    //     elHint.src = 'img/hint-white.png'
    //     return
    // }

    gHint.isOn = true
    gHint.elHint = elHint
    elHint.src = 'img/hint-yellow.png'
    // elHint.src = ''
}
