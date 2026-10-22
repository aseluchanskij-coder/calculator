class Calculator{
    constructor(previousOperandTextElement, currentOperandTextElement){
        this.previousOperandTextElement = previousOperandTextElement
        this.currentOperandTextElement = currentOperandTextElement
    }
}



const numberButtons = document.querySelectionAll('data-number')
const operationButtons = document.querySelectionAll('data-operation')
const equalsButton = document.querySelector('data-equals')
const deleteButton = document.querySelector('data-delete')
const allClearButton = document.querySelector('data-all-clear')
const previousOperandTextElementButton = document.querySelector('data-previous-operand')
const currentOperandTextElementButton = document.querySelector('data-current-operand')

