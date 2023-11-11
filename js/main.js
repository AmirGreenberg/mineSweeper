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
    renderBoard(gBoard)
    renderScoreBoard()
}

function resetVars() {
    clearInterval(gInterval)
    resetHints()
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
        firstCellIdx: {},
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
        gHint.isOn = false
        return
    }

    if (gGame.isFirstMove) {
        handleFirstMove(elCell, i, j)
        return
    }

    if (currCell.isMine) {
        gGame.lives--
        if (!gGame.lives) loseGame(gBoard, elCell, i, j)
    }

    if (!currCell.isMine) {
        currCell.isShown = true
        gGame.shownCount++
        expandShown(gBoard, elCell, i, j)
        if (checkifWin()) winGame(gGame, elCell, i, j)
    }

    renderClickedCell(elCell, i, j)
    renderScoreBoard()
}

function handleFirstMove(elCell, i, j) {
    startTimer()
    gGame.isOn = true
    gBoard.firstCellIdx = { i, j }
    addMines(gBoard)
    setMinesAroundCount(gBoard)
    renderBoard(gBoard)
    gGame.isFirstMove = false
    onCellClicked(elCell, i, j)
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
    if (currCell.isShown) return
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
    const elPlayAgain = document.querySelector('.play-again-container')
    elPlayAgain.classList.remove('hidden')
    document.querySelector('.smiley').innerText = WIN_SIGN
    gameOver()

    var name = prompt('What is Your name?')
    var finalTime = +document.querySelector('.timer').innerText
    localStorage.setItem('time', finalTime)
    var level = gLevel.ROWS * gLevel.COLS
    gLevel1.push({ time: finalTime, name: name })
    console.log('gLevel1: ', gLevel1)
    sortObjByNum(gLevel1)
    sortObjByNum(gLevel2)
    sortObjByNum(gLevel3)
}

function loseGame(board, elCell, rowIdx, colIdx) {
    renderPlayAgain()
    renderAllMines(board, elCell, rowIdx, colIdx)
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
    if (!gGame.isOn) return
    gHint.isOn = true
    gHint.elHint = elHint
    elHint.src = 'img/hint-yellow.png'
}

var gLeaderBoard = {
    levels: [gLevel1, gLevel2, gLevel3],
    ranks: 10,
}

var gLevel1 = [
    { time: 6.2, name: 'test1' },
    { time: 21.4, name: 'test2' },
    { time: 3, name: 'test3' },
    { time: 70, name: 'test4' },
    { time: 1, name: 'test5' },
]

var gLevel2 = [
    { time: 6.2, name: 'test1' },
    { time: 21.4, name: 'test2' },
    { time: 3, name: 'test3' },
    { time: 70, name: 'test4' },
    { time: 1, name: 'test5' },
]

var gLevel3 = [
    { time: 6.2, name: 'test1' },
    { time: 21.4, name: 'test2' },
    { time: 3, name: 'test3' },
    { time: 70, name: 'test4' },
    { time: 1, name: 'test5' },
]

//sorting objects in array by num
function sortObjByNum(leaderBoard) {
    leaderBoard.sort((l1, l2) => l1.time - l2.time)
    console.log('players by score:', leaderBoard)
}
