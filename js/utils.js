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
