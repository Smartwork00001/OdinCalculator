let shiftKeyOn = false;

const keyToStringMap = {
    "add":"+",
    "107":"+",
    "16187":"+",
    "+":"+",
    "subtract":"-",
    "109":"-",
    "189":"-",
    "-":"-",
    "multiply":"*",
    "106":"*",
    "1656":"*",
    "*":'*',
    "division":"/",
    "111":"/",
    "191":"/",
    "/":"/",
    "modulus":"%",
    "1653":"%",
    "openingBracket":"(",
    "1657":"(",
    "closingBracket":")",
    "1648":")",
    "187":"=",
    "13":"=",
    "equal":"=",
    "dot":".",
    "190":".",
    "sqrt": "t",
    "0":"0",
    "1":"1",
    "2":"2",
    "3":"3",
    "4":"4",
    "5":"5",
    "6":"6",
    "7":"7",
    "8":"8",
    "9":"9",
    "48":"0",
    "49":"1",
    "50":"2",
    "51":"3",
    "52":"4",
    "53":"5",
    "54":"6",
    "55":"7",
    "56":"8",
    "57":"9",
    "96":"0",
    "97":"1",
    "98":"2",
    "99":"3",
    "100":"4",
    "101":"5",
    "102":"6",
    "103":"7",
    "104":"8",
    "105":"9",
}

const digitSet = new Set(['0','1','2','3','4','5','6','7','8','9']);
const operatorSet = new Set(['+','-','*','/','t']);
const shiftKey = 16;
const buttonsList = document.querySelectorAll("button");
const calcExpression = document.querySelector("#calc-expression");
const calcAnswer = document.querySelector("#calc-answer");

function operatorPrecedence(operator){
    if(operator==='(' || operator === ')'){
        return 0;
    }else if(operator === '+' || operator === '-' ){
        return 2;
    }else if(operator === '*' || operator === '/' ){
        return 3;
    }else{
        return 4;
    }
}

function performOperation(operandStack, operatorStack){
    if(operatorStack.length===0){
        return NaN;
    }
    let operator = operatorStack.pop();
    if(operator === 't'){
        if(operandStack.length === 0){
            return NaN;
        }else{
            let operand = operandStack.pop();
            operandStack.push(Math.sqrt(operand));
        }
    }else{
        if(operandStack.length>1){
            let operandB = operandStack.pop();
            let operandA = operandStack.pop();
            if(operator === '+'){
                operandStack.push(operandA + operandB);
            }else if(operator === '-'){
                operandStack.push(operandA - operandB);
            }else if(operator === '*'){
                operandStack.push(operandA * operandB);
            }else{
                operandStack.push(operandA / operandB);
            }
        }else{
            return NaN;
        }
    }
    return 1;
}

function evaluateExpression(){
    let operandStack = [];
    let operatorStack = [];
    let prevCh = '(';
    const expression = '('+calcExpression.textContent+')';
    for(let i=0; i<expression.length; ++i){
        let ch = expression.charAt(i);
        if((prevCh==='(' && ch==='-') || digitSet.has(ch)){
            let j=i;
            ++i;
            while(i<expression.length && digitSet.has(expression.charAt(i))){
                ++i;
            }
            let num = parseInt(expression.substring(j,i));
            operandStack.push(num);
            --i;
        }else if(operatorSet.has(ch)){
            while(operatorStack.length>0 &&
                 operatorPrecedence(ch) <= operatorPrecedence(operatorStack[operatorStack.length-1])){
                
                let returnValue =performOperation(operandStack, operatorStack);
                if(isNaN(returnValue)){
                    return NaN;
                }
            }
            operatorStack.push(ch);
        }else if(ch=='('){
            operatorStack.push('(');
        }else if(ch==')'){
            while(operatorStack.length>0 &&
                operatorStack[operatorStack.length-1] !== '('){
                let returnValue = performOperation(operandStack, operatorStack);
                if(isNaN(returnValue)){
                    return NaN;
                }
            }
            if(operatorStack.length === 0 || 
                operatorStack[operatorStack.length-1] !== '('){
                return NaN;
            }
            operatorStack.pop();
        }
        prevCh = expression.charAt(i);
    }
    if(operandStack.length ===1 && operatorStack.length === 0){
        return operandStack[0];
    }else{
        return NaN;
    }
}

function eventsController(key){
    if(key === 8){
        key = "backspace";
    }
    if(key===shiftKey){
        shiftKeyOn = true;
        return;
    }
    if(shiftKeyOn){
        key=shiftKey+""+key;
        shiftKeyOn = false;
    }
    key=key+"";
    if(keyToStringMap[key] === "="){
        shiftKeyOn=false;
        let ans = evaluateExpression();
        calcExpression.textContent = "";
       
        if(isNaN(ans)){
            calcAnswer.textContent = "Malformed Expression";
        }else{
            calcAnswer.textContent = ans.toFixed(6);
        }
    }else if(key==="ac"){
        shiftKeyOn =false;
        calcExpression.textContent = '';
        calcAnswer.textContent = '';
    }else if(key === "backspace" ){
        shiftKeyOn = false;
        let tempExpression = calcExpression.textContent;
        calcExpression.textContent = tempExpression.substring(0,tempExpression.length-1);
    }else if(key === "prevAnswer"){
        shiftKeyOn = false;
        calcExpression.textContent = calcExpression.textContent+calcAnswer.textContent;
    }else if(keyToStringMap[key]){
        calcExpression.textContent = calcExpression.textContent+keyToStringMap[key];
    }
}

function buttonClickEvent(event){
    const buttonClicked = this.id;
    eventsController(buttonClicked);
}

function keyDownEvent(event){
    eventsController(event.keyCode);
}

buttonsList.forEach(btn => btn.addEventListener('click', buttonClickEvent));

window.addEventListener('keydown', keyDownEvent);
