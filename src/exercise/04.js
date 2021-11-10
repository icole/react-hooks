// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from '../utils'

function Board({currentSquares, onUpdate}) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onUpdate(i)}>
        {currentSquares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
  const [squares, setSquares] = useLocalStorageState('squares', Array(9).fill(null))
  const [history, setHistory] = useLocalStorageState('history', [Array(9).fill(null)])
  const [currentMove, setCurrentMove] = useLocalStorageState('currentMove', 0)
  const moves = history.map((selectedSquares, move) => {
    const message = move ? `Go to move #${move}` : 'Go to game start'
    return (!move || selectedSquares) ?
      <li key={move}><button disabled={currentMove === move} onClick={() => resetMove(move)}>{message}{currentMove === move ? " (current)" : ''}</button></li> : undefined
  })
  const nextValue = calculateNextValue(squares)
  const winner = calculateWinner(squares)
  const status = calculateStatus(winner, squares, nextValue)

  function resetMove(move) {
    const historySquares = move ? history[move] : Array(9).fill(null)
    setSquares(historySquares)
    setCurrentMove(move)
  }

  function restart() {
    setSquares(Array(9).fill(null))
    setHistory(Array(9).fill(null))
    setCurrentMove(0)
  }

  function selectSquare(square) {
    if(winner || squares[square]) return
    const squaresCopy = [...squares]
    const historyCopy = [...history]
    const nextMove = currentMove + 1
    historyCopy.length = nextMove + 1

    squaresCopy[square] = nextValue
    historyCopy[nextMove] = squaresCopy
    setSquares(squaresCopy)
    setHistory(historyCopy)
    setCurrentMove(nextMove)
  }


  return (
    <div className="game">
      <div className="game-board">
        <Board currentSquares={squares} onUpdate={selectSquare} />
      <button className="restart" onClick={restart}>
        restart
      </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
