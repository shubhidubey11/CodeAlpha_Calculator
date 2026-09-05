let currentInput = '';
let expression = '';

const expressionDisplay = document.getElementById('expression');
const resultDisplay = document.getElementById('result');

function updateDisplay() {
  expressionDisplay.textContent = expression;
  resultDisplay.textContent = currentInput || '0';
}

function appendNumber(num) {
  if (num === '.' && currentInput.includes('.')) return;
  if (currentInput === '0' && num !== '.') {
    currentInput = num;
  } else {
    currentInput += num;
  }
  updateDisplay();
}

function appendOperator(op) {
  if (currentInput === '' && expression === '') return;
  if (currentInput === '' && expression !== '') {
    expression = expression.slice(0, -1) + op;
  } else {
    expression += currentInput + ' ' + op + ' ';
    currentInput = '';
  }
  updateDisplay();
}

function clearDisplay() {
  currentInput = '';
  expression = '';
  updateDisplay();
}

function deleteLast() {
  currentInput = currentInput.slice(0, -1);
  updateDisplay();
}

function calculate() {
  if (currentInput === '' && expression === '') return;
  
  let fullExpression = expression + currentInput;
  if (!fullExpression) return;

  try {
    const sanitizedExpression = fullExpression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-');

    const evalResult = Function(`'use strict'; return (${sanitizedExpression})`)();
    
    if (!isFinite(evalResult)) {
      resultDisplay.textContent = 'Error';
      currentInput = '';
      expression = '';
      return;
    }

    currentInput = String(Math.round(evalResult * 1e8) / 1e8);
    expression = '';
    updateDisplay();
  } catch (error) {
    resultDisplay.textContent = 'Error';
    currentInput = '';
    expression = '';
  }
}