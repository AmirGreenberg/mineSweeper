'use strict'

function createMat(ROWS, COLS) {
    const mat = []
    for (var i = 0; i < ROWS; i++) {
        const row = []
        for (var j = 0; j < COLS; j++) {
            row.push({})
        }
        mat.push(row)
    }
    return mat
}

function getClassName(position) {
    const cellClass = `cell-${position.i}-${position.j}`
    return cellClass
}

function getRandomInt(min, max) {
    var diff = max - min
    var res = Math.floor(Math.random() * diff + min)
    return res
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

function startTimer() {
    gStartTime = new Date().getTime()
    gInterval = setInterval(updateTimer, 37)
}

function updateTimer() {
    const currentTime = new Date().getTime()
    const elapsedTime = (currentTime - gStartTime) / 1000
    document.querySelector('.timer').innerText = elapsedTime.toFixed(3)
}

function stopTimer() {
    var finalTime = document.querySelector('.timer').innerText
    var level = gLevel.ROWS * gLevel.COLS 
    localStorage.setItem(`${level}`, finalTime)
    clearInterval(gInterval)
}

function removeLevelClass(elLevel) {
    var elBtns = document.querySelectorAll('.levelBtn')
    for (var i = 0; i < elBtns.length; i++) {
        elBtns[i].classList.remove('clicked')
    }
    elLevel.classList.add('clicked')
}

function findEmptyCell(board) {
    var emptyCells = []

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            var currLocation = { i, j }
            if (
                !board[i][j].isMine &&
                !board[i][j].isMarked &&
                currLocation !== gBoard.firstCell
            ) {
                emptyCells.push({ i, j })
            }
        }
    }
    if (emptyCells.length === 0) return null

    const idx = getRandomInt(0, emptyCells.length)
    return emptyCells.splice(idx, 1)[0]
}
