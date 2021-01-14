const inquirer = require('inquirer')
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

    constructor() { }

    start() {
        console.log('$ node ailumette\n')
        this.displayMap()
        console.log('\n' + (this.turn ? 'Your turn:' : 'AI’s turn...'))
        this.round()
    }

    async round() {
        if (this.turn) {
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

            this.updateBoard()
        } else {
            //aiPlays()

        }
        //this.turn = this.turn ? 0 : 1
    }

    setLine() {
        return new Promise(resolve => {
            inquirer.prompt(this.questionLine)
                .then(answerLine => {
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

    updateBoard() {
        this.board[this.line - 1] = this.board[this.line - 1].fill(' ', (this.board[this.line - 1].lastIndexOf('|') + 1) - this.matches)

        let allMatchesCount = 0
        _.each(this.board, (line) => {
            allMatchesCount += _.countBy(line)["|"] || 0
        })

        console.log('allMatchesCount', allMatchesCount)

        console.log(`${this.turn ? 'Player' : 'AI'} removed ${this.matches} match(es) from line ${this.line}`)

        this.displayMap()

        if (allMatchesCount === 0) {
            console.log(this.turn ? 'I lost.. snif.. but I’ll get you next time!!' : 'You lost, too bad..')
        } else {
            this.line = this.matches = 0
            console.log('\n' + (this.turn ? 'Your turn:' : 'AI’s turn...'))
            this.round()
        }
    }

    isValidEntry(number, type) {
        const matchesCount = type === 'line'
            ? _.countBy(this.board[number - 1])["|"] || 0
            : _.countBy(this.board[this.line - 1])["|"] || 0

        if (number < 0 || typeof number !== 'number') {
            console.log('Error: invalid input (positive number expected)')
            return false
        } else if (type === 'line') {
            if (number === 0 || number > 4) {
                console.log('Error: this line is out of range')
                return false
            } else if (matchesCount === 0) {
                console.log('Error: there’s no more matches here')
                return false
            }
        } else if (type === 'matches') {
            if (number === 0) {
                console.log('Error: you have to remove at least one match')
                return false
            } else if (number > 3) {
                console.log('Error: the maximum number of matches is 3')
                return false
            } else if (number > matchesCount) {
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
        console.log('*********')
    }
}

const ailumette = new Ailumette()

ailumette.start()
