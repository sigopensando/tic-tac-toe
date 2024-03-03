import {useState} from 'react'
import './App.css'
import confetti from 'canvas-confetti'
import {Square} from "./components/Square.jsx";
import {TURNS} from "./constants.js";
import {checkWinnerFrom, checkEndGame} from "./logic/board.js";
import WinnerModal from "./components/WinnerModal.jsx";

function App() {
    const [board, setBoard] = useState(() => {
        const boardFromStorage = window.localStorage.getItem('board');
        if(boardFromStorage) return JSON.parse(boardFromStorage);
        return Array(9).fill(null);
    });
    const [turn, setTurn] = useState(() => {
        const turnFromStorage = window.localStorage.getItem('turn');
        return turnFromStorage ?? TURNS.X
    });
    const [winner, setWinner] = useState(null);
    const updateBoard = (index) => {
        // does not update if the box is filled
        if (board[index] || winner) return
        // update board
        const newBoard = [...board];
        newBoard[index] = turn;
        setBoard(newBoard);
        // change turn
        const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
        setTurn(newTurn);
        // save game
        window.localStorage.setItem('board', JSON.stringify(newBoard));
        window.localStorage.setItem('turn', newTurn);
        const newWinner = checkWinnerFrom(newBoard);
        if (newWinner) {
            confetti()
            setWinner(newWinner)
        } else if(checkEndGame(newBoard)) {
            setWinner(false)
        }
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setTurn(TURNS.X);
        setWinner(null);
        window.localStorage.removeItem('board')
        window.localStorage.removeItem('turn')
    };

    return (
        <main className="board">
            <h1>Tic tac toe</h1>
            <button onClick={resetGame}>Reset game</button>
            <section className="game">
                {
                    board.map((square, index) => {
                        return (
                            <Square key={index} index={index} updateBoard={updateBoard}>
                                {square}
                            </Square>
                        )
                    })
                }
            </section>
            <WinnerModal winner={winner} resetGame={resetGame}/>
            <section className="turn">
                <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
                <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
            </section>
        </main>
    )

}

export default App
