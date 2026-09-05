let currentInput = '';
let expression = '';

function getDisplays() {
  return {
    expressionDisplay: document.getElementById('expression'),
    resultDisplay: document.getElementById('result')
  };
}

function updateDisplay() {
  const { expressionDisplay, resultDisplay } = getDisplays();
  if (expressionDisplay) expressionDisplay.textContent = expression;
  if (resultDisplay) resultDisplay.textContent = currentInput || '0';
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
    expression = expression.trim().slice(0, -1) + ' ' + op + ' ';
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
  if (currentInput.length > 0) {
    currentInput = currentInput.slice(0, -1);
  } else if (expression.length > 0) {
    let trimmed = expression.trim();
    trimmed = trimmed.slice(0, -1).trim();
    
    const lastSpace = trimmed.lastIndexOf(' ');
    if (lastSpace !== -1) {
      currentInput = trimmed.slice(lastSpace + 1);
      expression = trimmed.slice(0, lastSpace + 1);
    } else {
      currentInput = trimmed;
      expression = '';
    }
  }
  updateDisplay();
}

function calculate() {
  if (currentInput === '' && expression === '') return;
  
  let fullExpression = expression + currentInput;
  if (!fullExpression) return;

  const { resultDisplay } = getDisplays();

  try {
    const sanitizedExpression = fullExpression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-');

    const evalResult = Function(`'use strict'; return (${sanitizedExpression})`)();
    
    if (!isFinite(evalResult)) {
      if (resultDisplay) resultDisplay.textContent = 'Error';
      currentInput = '';
      expression = '';
      return;
    }

    currentInput = String(Math.round(evalResult * 1e8) / 1e8);
    expression = '';
    updateDisplay();
  } catch (error) {
    if (resultDisplay) resultDisplay.textContent = 'Error';
    currentInput = '';
    expression = '';
  }
}