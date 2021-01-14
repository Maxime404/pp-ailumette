const inquirer = require('inquirer')
const { isEmpty } = require('lodash')
const _ = require('lodash')

class Ailumette {
    line = 0
    matches = 0
    turn = 1
    board = [
        [' ', ' ', ' ', '|', ' ', ' ', ' '],
        [' ', ' ', '|', '|', '|', ' ', ' '],
        [' ', '|', '|', "|", '|', '|', ' '],
        ['|', '|', '|', '|', '|', '|', '|']
    ]
    boardCopy = [
        [0, 0, 0, 1, 0, 0, 0],
        [0, 0, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1]
    ]
    questionLine = [{
        type: 'input',
        name: 'line',
        message: "Line:",
    }]
    questionMatches = [{
        type: 'input',
        name: 'matches',
        message: "Matches:",
    }]

    constructor() {
        console.log('$ node ailumette\n')
        this.displayMap()
    }

    async round() {
        if (this.turn) {
            console.log('Your turn:')

            while (this.line === 0) {
                const line = await this.setLine()
                if (this.isValidEntry(line, 'line')) {
                    this.line = line
                }
            }
            while (this.matches === 0) {
                const matches = await this.setMatches()
                if (this.isValidEntry(matches, 'matches')) {
                    this.matches = matches
                }
            }

        } else {
            console.log('AI’s turn...')


        }
        this.turn = this.turn ? 0 : 1
    }

    setLine() {
        return new Promise(resolve => {
            inquirer.prompt(this.questionLine)
                .then(answerLine => {
                    console.log(answerLine.line)
                    resolve(parseInt(answerLine.line))
                })
        })
    }

    setMatches() {
        return new Promise(resolve => {
            inquirer.prompt(this.questionMatches)
                .then(answerMatches => {
                    resolve(parseInt(answerMatches.matches))
                })
        })
    }

    update() {
        this.displayMap()
    }

    isValidEntry(number, type) {
        if (number < 0 || typeof number !== 'number' || !number) {
            console.log('Error: invalid input (positive number expected)')
            return false
        } else if (type === 'line') {
            if (number === 0 || number > 4) {
                console.log('Error: this line is out of range')
                return false
            }
        } else if (type === 'matches') {
            if (number === 0) {
                console.log('Error: you have to remove at least one match')
                return false
            } else if (number > 3) {
                console.log('Error: the maximum number of matches is 3')
                return false
            }
            const matchesCount = _.countBy(this.board[this.line])["|"]
            console.log('matchesCount :', matchesCount)

            if (number > matchesCount) {
                console.log('Error: not enough matches on this line')
                return false
            }
        }
        return true
    }

    displayMap() {
        console.log('*********')
        _.each(this.board, (line) => {
            console.log('*' + line.join('') + '*')
        })
        console.log('*********\n')
    }

    getValues() {
        console.log(this.line, this.matches)
    }
}

const ailumette = new Ailumette()

ailumette.round()
