import React, {useEffect, useState} from 'react';

import Header from './components/header/Header';
import Keypad from './components/keypad/Keypad';
import moonIcon from "./assets/moon.jpeg";
import sunIcon from "./assets/Sun.jpeg";

import './App.css';

const usedKeyCodes = [
  67, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 97, 98, 99, 100, 101, 102, 103, 104, 105, 8, 13, 190, 187, 189, 191, 56, 111, 106, 107, 109,
];
const numbers=["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const operators=["-", "+", "*", "/"];
function App() {
  const [isDarkMode, setIsDarkMode]=useState(JSON.parse(localStorage.getItem("calculator-app-mode")) || false);
  const [expression, setExpression]=useState("");
  const [result, setResult]=useState("");
  const [history, setHistory]=useState([]);
  const handleKeyPress=(keyCode, key)=>{
    if(!keyCode) return;
    if(!usedKeyCodes.includes(keyCode)) return;
    if(numbers.includes(key))
    {
      if(key === "0")
      {
        if(expression.length===0)return;
      }
      calculateResult(expression+key);
      setExpression(expression+key);
      // console.log("number")
    }
    else if(operators.includes(key))
    {
      if(!expression)return;
      const lastChar=expression.slice(-1);
      if(operators.includes(lastChar))return;
      if(lastChar === ".")return;
      setExpression(expression + key);
      // console.log("operator")
    }
    else if(key===".")
    {
      if(!expression)return;
      const lastChar=expression.slice(-1);
      if(!numbers.includes(lastChar))return;
      setExpression(expression+key);

    }
    else if(keyCode===8)
    {
      // console.log("backspace")
      if(!expression)return;
      calculateResult(expression.slice(0, -1));
      setExpression(expression.slice(0, -1));
    }
    else if(keyCode===13)
    {
      // console.log("enter")
      if(!expression)return;
      calculateResult(expression);
      const tempHistory=[...history];
      if(tempHistory.length>20)
        tempHistory=tempHistory.splice(0, 1);
      tempHistory.push(expression);
      setHistory(tempHistory);
    }
    else if(keyCode===67){
      calculateResult("");
      setExpression("");
      setHistory("");
      console.log(expression);
    }
  };

  const calculateResult=(exp)=>{
    if(!exp){
      setResult("");
      return;
    }
    const lastChar=exp.slice(-1);
    if(!numbers.includes(lastChar))exp=exp.slice(0,-1);

    const answer=eval(exp).toFixed(2)+"";//answer to 2 decimal places
    setResult(answer);
  }
  useEffect(() =>{
    localStorage.setItem("calculator-app-mode", JSON.stringify(isDarkMode))
  }, [isDarkMode])
  return (
    <div className="app" 
    tabIndex="0"
    onKeyDown={(event)=>handleKeyPress(event.keyCode, event.key)}
    data-theme={isDarkMode?"dark":""}>
      <div className="app_calculator">
        <div className='app_calculator_navbar'>
          <div className='app_calculator_navbar_toggle'
            onClick={()=>setIsDarkMode(! isDarkMode)}
            >
            <div className={`app_calculator_navbar_toggle_circle ${
              isDarkMode?
              "app_calculator_navbar_toggle_circle_active" : ""
              }`}>
            </div>
            <img src={isDarkMode? moonIcon : sunIcon} alt="mode"/>
          </div>
        </div>
        <Header expression={expression} result={result} history={history} />
        <Keypad handleKeyPress={handleKeyPress} />
      </div>
    </div>
  );
}

export default App;
