import { useState } from "react";


function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {

    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares,i);
  }
  const object = calculateWinner(squares);
  let status;
  if (object) {
    status = "Winner: " + object.winner;
    highlight(object.pos[0],object.pos[1],object.pos[2]);
  } 
  else if (squares.every((square) => square !== null)) { 
    status = "It's a Draw";
  }
  else {
    status = "Next player: " + (xIsNext ? "X" : "O");
    const squares = document.querySelectorAll(".square");
    squares.forEach((square) => {
      square.style.backgroundColor = "white";
    });
  }
  const boarded = Array(3).fill(null).map((_, i) => {
    return (
      <div className="board-row" key={i}>
        {Array(3).fill(null).map((_, j) => {
          const index = i * 3 + j;
          return (
            <Square
              key={index}
              value={squares[index]}
              onSquareClick={() => handleClick(index)}
            />
          );
        })}
      </div>
    );
  });
  return (<>
          <div className="status">{status}</div>
          {boarded}
      </>);

}

export default function Game() {
 
  const [history, setHistory] = useState([Array(9).fill(null)]); // [squares, squares, squares, ...
  const [indexes, setIndexes] = useState([Array(2).fill(null)]); // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9
  const [currentMove, setCurrentMove] = useState(0); // 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, ...
  const xIsNext = currentMove % 2 === 0;
  const [ascending, setAscending] = useState(true);
  const currentSquares = history[currentMove];
  
  //const [winnerPos, setWinnerPos] = useState([]);
  //cons [movees , setMovees] = useState([])
  //const [squares, setSquares] = useState(Array(9).fill(null));
  

  function handlePlay(nextSquares,i) {
    const nextHistory = [...history.slice(0, currentMove + 1),nextSquares];
    const nextIndexes = [...indexes.slice(0, currentMove + 1),i];

    setHistory(nextHistory);
    setIndexes(nextIndexes);
    setCurrentMove(nextHistory.length - 1);
    
    
  }
  function jumpTo(nextMove) {
    // TODO
    setCurrentMove(nextMove);
    setHistory(history.slice(0, nextMove + 1));
    setIndexes(indexes.slice(0, nextMove + 1));
    
  }
  function sortMoves() {
    // TODO
    // console.log(moves);
    // moves.reverse();
    // console.log(moves);
    setAscending(!ascending);
    
    
  }
  let sortDescription = ascending ? "Ascending" : "Descending";
  
  const moves = history.map((squares, move) => {
    let description;
    let index = indexes[move];
   
    if (move > 0) {
      description = "Go to move #" + move + " (" + Math.floor(index / 3) + ", " + index % 3 + ")";
    } else {
      description = "Go to game start";
    }
    if (move === currentMove) {
      description =  "You are at move #" + move ;
      return  (
        <li key={move}>
          {description}
        </li>
      );

    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });
  if (!ascending) { 
    moves.reverse();
  };

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <div>{moves}</div>
      </div>
      <div className = "sort">
        <button onClick={sortMoves}>{sortDescription}</button>
      </div>
    </div>
  );
}
function highlight(i,j,k) {
  const squares = document.querySelectorAll(".square");
  squares[i].style.backgroundColor = "yellow";
  squares[j].style.backgroundColor = "yellow";
  squares[k].style.backgroundColor = "yellow";
}

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
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {winner : squares[a] , pos : [a,b,c]};
    }
  }
  return null;
}
