import { useReducer } from "react";
import "./Style.css";
import NumberButton from "./NumberButton";
import OperationButton from "./OperatorButton";

export const ACTIONS = {
  ADD_DIGIT: "addDigit",
  CLEAR: "clear",
  DELETE_DIGIT: "deleteDigit",
  CHOOSE_OPERATION: "chooseOperation",
  EVALUATE: "evaluate",
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentValue: payload.digit,
          overwrite: false,
        };
      }
      if (payload.digit === "0" && state.currentVal === "0") {
        return state;
      }
      if (payload.digit === "." && state.currentVal.includes(".")) {
        return state;
      }

      return {
        ...state,
        currentVal: `${state.currentVal || ""}${payload.digit}`,
      };
    case ACTIONS.CLEAR:
      return {};
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentVal == null && state.previousVal == null) {
        return state;
      }
      if (state.currentVal == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }
      if (state.previousVal == null) {
        return {
          ...state,
          operation: payload.operation,
          previousVal: state.currentVal,
          currentVal: null,
        };
      }

      return {
        ...state,
        previousVal: evaluate(state),
        operation: payload.operation,
        currentVal: null,
      };
    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.currentVal == null ||
        state.previousVal == null
      ) {
        return state;
      }
      return {
        ...state,
        previousVal: null,
        operation: null,
        currentVal: evaluate(state),
        overwrite: true,
      };
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentVal: null,
          overwrite: false,
        };
      }
      if (state.currentVal == null) {
        return state;
      }
      if (state.currentVal.length === 1) {
        return { ...state, currentVal: null };
      }
      return {
        ...state,
        currentVal: state.currentVal.slice(0, -1),
      };
  }
};

function evaluate(state) {
  let { currentVal, previousVal, operation } = state;
  let result = "";
  currentVal = parseFloat(currentVal);
  previousVal = parseFloat(previousVal);
  if (isNaN(previousVal) || isNaN(currentVal)) {
    return result;
  }
  switch (operation) {
    case "+":
      result = currentVal + previousVal;
      break;
    case "-":
      result = previousVal - currentVal;
      break;
    case "*":
      result = currentVal * previousVal;
      break;
    case "÷":
      result = previousVal / currentVal;
      break;
  }
  return result;
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

// const formatOperand = (value) => {
//   if (value == null) return;
//   const [integer, decimal] = value.split(".");
//   if (decimal == null) return INTEGER_FORMATTER.format(integer);
//   return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
// };

function App() {
  const [{ currentVal, previousVal, operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previousVal">
          {/* {formatOperand(previousVal)} {operation} */}
          {previousVal} {operation}
        </div>
        <div className="currentVal">{currentVal}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
        DEL
      </button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <NumberButton digit="1" dispatch={dispatch} />
      <NumberButton digit="2" dispatch={dispatch} />
      <NumberButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <NumberButton digit="4" dispatch={dispatch} />
      <NumberButton digit="5" dispatch={dispatch} />
      <NumberButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <NumberButton digit="7" dispatch={dispatch} />
      <NumberButton digit="8" dispatch={dispatch} />
      <NumberButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <NumberButton digit="." dispatch={dispatch} />
      <NumberButton digit="0" dispatch={dispatch} />
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
      >
        =
      </button>
    </div>
  );
}

export default App;
