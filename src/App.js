import React, { useReducer } from 'react'
import Digitbtn from './Digitbtn'
import Operationbtn from './Operationbtn'
import "./styles.css"

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}

function reducer(state, {type, payload }) {
  switch(type){
    case ACTIONS.ADD_DIGIT:
      if(state.overwrite){
        return{
          ...state,
          currentoperand: payload.digit,
          overwrite: false,
        }
      }
      if (payload.digit === "0" && state.currentoperand === "0") {
        return state
      }
      if (payload.digit === "." && state.currentoperand.includes(".")) {
        return state
      }
    
      return {
        ...state,
        currentoperand: `${state.currentoperand || ""}${payload.digit}`
      }
      case ACTIONS.CHOOSE_OPERATION:
        if(state.currentoperand === null && state.previousoperand === null){
          return state
        }

        if (state.currentoperand == null){
          return{
            ...state,
            operation: payload.operation,
          }
        }

        if(state.previousoperand == null){
          return {
            ...state,
            operation: payload.operation,
            previousoperand: state.currentoperand,
            currentoperand: null,
          }
        }

        return {
          ...state,
          previousoperand: evaluate(state),
          operation: payload.operation,
          currentoperand: null
        }
      case ACTIONS.CLEAR:
        return{}
      case ACTIONS.DELETE_DIGIT:
        if (state.overwrite) {
          return {
            ...state,
            overwrite: false,
            currentoperand: null,
          }
        }
        if (state.currentoperand == null) return state 
        if (state.currentoperand.lenght === 1){
          return{...state,currentoperand:null}
        }

        return{
          ...state,
          currentoperand: state.currentoperand.slice(0, -1)
        }
      case ACTIONS.EVALUATE:
        if (state.operation == null || state.currentoperand == null || state.previousoperand == null){
          return state
        }

        return {
          ...state,
          overwrite: true,
          previousoperand: null,
          operation: null,
          currentoperand: evaluate(state)
        }
  }
}

function evaluate ({currentoperand, previousoperand, operation}){

  const prev = parseFloat(previousoperand)
  const current = parseFloat(currentoperand)
  if(isNaN(prev) || isNaN(current) )  return ""
  let computatuion = ""
  switch (operation) {
    case "+" :
      computatuion = prev + current
      break
    case "-" :
      computatuion = prev - current
      break
    case "*" :
        computatuion = prev * current
        break
    case "÷" :
      computatuion = prev / current
      break
  }

  return computatuion.toString()
}

export default function App() {
  const [{currentoperand, previousoperand, operation}, dispatch] = useReducer(reducer,{})

  // dispatch({type: ACTIONS.ADD_DIGIT, payload:{digit:1}})
  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operant">{previousoperand} {operation}</div>
        <div className="current-operant">{currentoperand}</div>
      </div>
      <button className="span-two" onClick={()=> dispatch({type: ACTIONS.CLEAR})}>AC</button>
      <button onClick={()=> dispatch({type: ACTIONS.DELETE_DIGIT})}>DEL</button>
      <Operationbtn operation="÷" dispatch={dispatch} />
      <Digitbtn digit="1" dispatch={dispatch} />
      <Digitbtn digit="2" dispatch={dispatch} />
      <Digitbtn digit="3" dispatch={dispatch} />
      <Operationbtn operation="*" dispatch={dispatch} />
      <Digitbtn digit="4" dispatch={dispatch} />
      <Digitbtn digit="5" dispatch={dispatch} />
      <Digitbtn digit="6" dispatch={dispatch} />
      <Operationbtn operation="+" dispatch={dispatch} />
      <Digitbtn digit="7" dispatch={dispatch} />
      <Digitbtn digit="8" dispatch={dispatch} />
      <Digitbtn digit="9" dispatch={dispatch} />
      <Operationbtn operation="-" dispatch={dispatch} />
      <Digitbtn digit="." dispatch={dispatch} />
      <Digitbtn digit="0" dispatch={dispatch} />
      <button className="span-two" onClick={()=> dispatch({type: ACTIONS.EVALUATE})}>=</button>
    </div>
  )
}