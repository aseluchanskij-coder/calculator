class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement
        this.currentOperandTextElement = currentOperandTextElement
        this.clear()
    }

    clear() {
        this.currentOperand = ''
        this.expression = [] //masyv
        this.readyToReset = false 
    }

    delete() {
        if (this.currentOperand === 'Klaida' || this.currentOperand === 'Dalyba iš nulio') {
            this.clear()
            return
        }
        if (this.readyToReset) {
            this.currentOperand = ''
            this.readyToReset = false
            return
        }
        if (this.currentOperand !== '') {
            this.currentOperand = this.currentOperand.toString().slice(0, -1)
        } else if (this.expression.length > 0) {
            this.expression.pop() 
            this.currentOperand = this.expression.pop() || '' 
        }
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return
        
        if (this.readyToReset) {
            this.currentOperand = number.toString()
            this.readyToReset = false
            return
        }
        this.currentOperand = this.currentOperand.toString() + number.toString()
    }

    chooseOperation(operation) {
        if (this.currentOperand === '' && operation === '-') {
            this.currentOperand = '-'
            return
        }
        
        if (this.currentOperand === '' && this.expression.length > 0) {
            this.expression[this.expression.length - 1] = operation
            return
        }
        
        if (this.currentOperand === '' || this.currentOperand === '-') return

        this.expression.push(this.currentOperand)
        this.expression.push(operation)
        this.currentOperand = ''
        this.readyToReset = false
    }

    computeSingle(operation) {
        if (this.currentOperand === '' || this.currentOperand === '-') return
        let current = parseFloat(this.currentOperand)
        if (isNaN(current)) return
        let computation

        switch (operation) {
            case 'x²':
                computation = current ** 2
                break
            case '√':
                if (current < 0) {
                    this.currentOperand = 'Klaida'
                    return
                }
                computation = Math.sqrt(current)
                break
            case '!':
                if (current < 0 || !Number.isInteger(current)) {
                    this.currentOperand = 'Klaida' 
                    return
                }
                computation = 1
                for (let i = 2; i <= current; i++) {
                    computation *= i
                }
                break
            case 'sin':
                const radians = current * (Math.PI / 180)
                computation = parseFloat(Math.sin(radians).toFixed(10))
                break
            default:
                return
        }
        this.currentOperand = computation.toString()
        this.readyToReset = true
    }

    compute() {
        if (this.currentOperand === '' && this.expression.length === 0) return
        
        let finalExpression = [...this.expression]
        
        if (this.currentOperand !== '' && this.currentOperand !== '-') {
            finalExpression.push(this.currentOperand)
        } else if (finalExpression.length > 0 && ['+', '-', '*', '÷', '^'].includes(finalExpression[finalExpression.length - 1])) {
            finalExpression.pop()
        }

        if (finalExpression.length === 0) return

        let evalString = finalExpression.join(' ')
            .replace(/÷/g, '/')
            .replace(/\^/g, '**')

        try {
            let result = new Function('return ' + evalString)()
            
            if (isNaN(result)) {
                this.currentOperand = 'Klaida'
            } else if (!isFinite(result)) {
                this.currentOperand = 'Dalyba iš nulio'
            } else {
                result = Math.round(result * 10000000000) / 10000000000
                this.currentOperand = result.toString()
            }
        } catch (error) {
            this.currentOperand = 'Klaida'
        }

        this.expression = []
        this.readyToReset = true
    }

    getDisplayNumber(number) {
        if (number === 'Klaida' || number === 'Dalyba iš nulio') return number
        if (number === '-') return '-'
        if (number === '') return ''
        
        const stringNumber = number.toString()
        const integerDigits = parseFloat(stringNumber.split('.')[0])
        const decimalDigits = stringNumber.split('.')[1]
        let integerDisplay
        if (isNaN(integerDigits)) {
            integerDisplay = ''
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 })
        }
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`
        } else {
            return integerDisplay
        }
    }

    updateDisplay() {
        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand)
        
        if (this.expression.length > 0) {
            this.previousOperandTextElement.innerText = this.expression.map(token => {
                if (['+', '-', '*', '÷', '^'].includes(token)) {
                    return token
                }
                return this.getDisplayNumber(token)
            }).join(' ')
        } else {
            this.previousOperandTextElement.innerText = ''
        }
    }
}

const numberButtons = document.querySelectorAll('[data-number]')
const operationButtons = document.querySelectorAll('[data-operation]')
const equalsButton = document.querySelector('[data-equals]')
const deleteButton = document.querySelector('[data-delete]')
const allClearButton = document.querySelector('[data-all-clear]')
const previousOperandTextElement = document.querySelector('[data-previous-operand]')
const currentOperandTextElement = document.querySelector('[data-current-operand]')

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText)
        calculator.updateDisplay()
    })
})

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        const op = button.dataset.operation || button.innerText 
        
        if (op === 'x²' || op === '√' || op === '!' || op === 'sin') {
            calculator.computeSingle(op)
        } else {
            calculator.chooseOperation(op)
        }
        calculator.updateDisplay()
    })
})

equalsButton.addEventListener('click', () => {
    calculator.compute()
    calculator.updateDisplay()
})

allClearButton.addEventListener('click', () => {
    calculator.clear()
    calculator.updateDisplay()
})

deleteButton.addEventListener('click', () => {
    calculator.delete()
    calculator.updateDisplay()
})