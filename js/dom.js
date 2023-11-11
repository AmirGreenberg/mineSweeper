function renderBoard(board) {
    var strHTML = ''
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[i].length; j++) {
            const currCell = board[i][j]
            var cellClass = getClassName({ i, j })

            if (currCell.isMine) cellClass += ' mine'
            else if (!currCell.isMine) cellClass += ' safe'

            if (
                gGame.isFirstMove &&
                gGame.isOn &&
                gBoard.firstCellIdx.i === i &&
                gBoard.firstCellIdx.j === j
            )
                cellClass += ' selected'

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
    elBoard.innerHTML = strHTML
}

function renderClickedCell(elCell, i, j) {
    const currCell = gBoard[i][j]
    if (gHint.isOn && gGame.hints > 0) {
        renderHints(elCell, currCell)
        return
    }
    if (!currCell.isMine) {
        renderSafeCell(elCell)
        return
    }

    if (currCell.isMine) {
        renderMineCell(elCell)
        return
    }
}

function renderMarkedCell(elCell, i, j) {
    const gElSelectedCell = elCell.querySelector('.marked')
    gElSelectedCell.classList.toggle('hidden')
}

function levelModal(toDO) {
    const elLevel = document.querySelector('.level-modal')

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

function renderScoreBoard() {
    var strikeCounter = gShownTarget - gGame.shownCount
    document.querySelector('.strikes-counter').innerText = strikeCounter

    var marksCounter = gLevel.MINES - gGame.markedCount
    document.querySelector('.marks-counter').innerText = marksCounter

    var livesCounter = gGame.lives
    document.querySelector('.lives-counter').innerText = livesCounter

    document.querySelector('.result').innerText = ''
}

function darkModeToggle() {
    var element = document.body
    element.classList.toggle('dark-mode')
    var elDark = document.querySelector('span2')
    elDark.innerText = gIsDarkMode ? '' : 'Disable'
    gIsDarkMode = !gIsDarkMode
}

function resetHints() {
    const elHints = document.querySelectorAll('.all-hints img')
    for (let i = 0; i < elHints.length; i++) {
        elHints[i].hidden = false
        elHints[i].src = 'img/hint-white.png'
    }
}

function renderHints(elCell, currCell) {
    if (!currCell.isMine) {
        const gElSelectedCell = elCell.querySelector('.negCount')
        gElSelectedCell.classList.remove('hidden')
        setTimeout(() => gElSelectedCell.classList.add('hidden'), 1000)
    } else if (currCell.isMine) {
        const gElSelectedCellMine = elCell.querySelector('.mine')
        gElSelectedCellMine.classList.remove('hidden')
        setTimeout(() => gElSelectedCellMine.classList.add('hidden'), 1000)
    }
    gHint.elHint.src = ''
}

function renderSafeCell(elCell) {
    const gElSelectedCell = elCell.querySelector('.negCount')
    gElSelectedCell.classList.remove('hidden')
    elCell.classList.add('selected')
}

function renderMineCell(elCell) {
    const gElSelectedCell = elCell.querySelector('.mine')
    gElSelectedCell.classList.remove('hidden')
    if (gGame.mineCount === 0) elCell.classList.add('selected')
    if (gGame.lives > 0) {
        setTimeout(() => gElSelectedCell.classList.add('hidden'), 200)
        setTimeout(() => elCell.classList.remove('selected'), 200)
    }
}

function renderPlayAgain(){
    const elBoard = document.querySelector('.result')
    elBoard.innerText = 'You Lost 😔'
    const elPlayAgain = document.querySelector('.play-again-container')
    elPlayAgain.classList.remove('hidden')
    document.querySelector('.smiley').innerText = LOSE_SIGN
}

function renderAllMines(board, elCell, rowIdx, colIdx){
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
}

function removeLevelClass(elLevel) {
    var elBtns = document.querySelectorAll('.levelBtn')
    for (var i = 0; i < elBtns.length; i++) {
        elBtns[i].classList.remove('clicked')
    }
    elLevel.classList.add('clicked')
}

// function renderLeaderBoard(){
//     var strHTML = ''
//     const elBoard = document.querySelector('.leaderboard 1')
//     elBoard.innerHTML = strHTML

//     for (var i = 0; i < gLevel1.length; i++) {
//         strHTML += '<tr>\n'

//             if (currCell.isMine) cellClass += ' mine'
//             else if (!currCell.isMine) cellClass += ' safe'

//             if (
//                 gGame.isFirstMove &&
//                 gGame.isOn &&
//                 gBoard.firstCellIdx.i === i &&
//                 gBoard.firstCellIdx.j === j
//             ){
//                 cellClass += ' selected'

//             strHTML += `\t<td class="cell ${cellClass}" 
//                         onclick="onCellClicked(this, ${i}, ${j})"
//                         oncontextmenu="onCellMarked(this, ${i}, ${j})">
//                         <span class="hidden negCount" >${currCell.minesAroundCount}</span>
//                         <span class="hidden marked" >${MARKED_SIGN}</span>`

//             if (currCell.isMine) {
//                 strHTML += `<span class="hidden mine" >${MINE_SIGN}</span>`
//             }

//             strHTML += '</td>\n'
//         }
//         strHTML += '</tr>\n'
//     }
//     elBoard.innerHTML = strHTML
// }
