/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

import blueCandy from './images/blue-candy.png'
import greenCandy from './images/green-candy.png'
import orangeCandy from './images/orange-candy.png'
import purpleCandy from './images/purple-candy.png'
import redCandy from './images/red-candy.png'
import yellowCandy from './images/yellow-candy.png'
import blank from './images/blank.png'

const width = 8;

const candyColors = [
  blueCandy,
  purpleCandy,
  greenCandy,
  yellowCandy,
  redCandy,
  orangeCandy 
]


function App() {

  const [currentColorArrangement, setCurrentColorArrangement] = useState([])
  const [squareBeingDragged, setSquareBeingDragged] = useState(null)
  const [squareBeingReplased, setSquareBeingReplased] = useState(null)
  
  const checkForColumnOfFour = () => {
    for(let i=0; i <= 39; i++) {
      const columnOfFour = [i, i+ width, i + width*2, i + width*3]
      const decidedColors = currentColorArrangement[i]
      if (columnOfFour.every(square => currentColorArrangement[square] === decidedColors )) {
        columnOfFour.forEach(square => currentColorArrangement[square] = blank)
        return true
      }
    }
  }

  const checkForRowOfFour = () => {
    for(let i=0; i < 64; i++) {
      const rowOfFour = [i, i+ 1, i + 2, i + 3]
      const decidedColors = currentColorArrangement[i]
      const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 62, 63, 64]
      if(!notValid.includes(i)) continue
      if (rowOfFour.every(square => currentColorArrangement[square] === decidedColors )) {
        rowOfFour.forEach(square => currentColorArrangement[square] = blank)
        return true
      }
    }
  }

  const checkForColumnOfThree = () => {
    for(let i=0; i <= 47; i++) {
      const columnOfThree = [i, i+ width, i + width*2]
      const decidedColors = currentColorArrangement[i]
      if (columnOfThree.every(square => currentColorArrangement[square] === decidedColors )) {
        columnOfThree.forEach(square => currentColorArrangement[square] = blank)
        return true
      }
    }
  }

  const checkForRowOfThree = () => {
    for(let i=0; i < 64; i++) {
      const rowOfThree = [i, i+ 1, i + 2, i + 3]
      const decidedColors = currentColorArrangement[i]
      const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64]
      if(!notValid.includes(i)) continue
      if (rowOfThree.every(square => currentColorArrangement[square] === decidedColors )) {
        rowOfThree.forEach(square => currentColorArrangement[square] = blank)
        return true
      }
    }
  }

  const moveIntoSquareBelow = () => {
    for(let i = 0; i <= 55; i++) {
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7]
      const isFirstRow = firstRow.includes(i)

      if(isFirstRow && currentColorArrangement[i] === '') {
        let randomNumber = Math.floor(Math.random()*candyColors.length)
        currentColorArrangement[i] = candyColors[randomNumber]
      }
      if(currentColorArrangement[i + width] === '') {
        currentColorArrangement[i + width] = currentColorArrangement[i]
        currentColorArrangement[i] = blank
      }
    }
  }

  const createBoard = () => {
    const randomColorsArrangement = []
    for (let i = 0; i < width*width; i++) {
      const randomColors= candyColors[Math.floor(Math.random() * candyColors.length)]
      randomColorsArrangement.push(randomColors)
      setCurrentColorArrangement(randomColorsArrangement)
    }
  }
  
  const dragStart = (e) => {
    setSquareBeingDragged(e.target)
  }

  const dragDrop = (e) => {
    setSquareBeingReplased(e.target)
  }

  const dragEnd = () => {
    const squareBeingDraggedId = parseInt(squareBeingDragged.getAttribute('data-id'))
    const squareBeingReplasedId = parseInt(squareBeingReplased.getAttribute('data-id'))

    currentColorArrangement[squareBeingReplasedId] = squareBeingDragged.style.backgroundColor
    currentColorArrangement[squareBeingDraggedId] = squareBeingReplased.style.backgroundColor

    const validMoves = [
      squareBeingDragged - 1,
      squareBeingDragged - width,
      squareBeingDragged + 1,
      squareBeingDragged + width
    ]

    const validMove = validMoves.includes(squareBeingReplasedId)

    const isAOfColumnFour = checkForColumnOfFour()
    const isAOfRowFour = checkForRowOfFour()
    const isAOfColumnThree = checkForColumnOfThree()
    const isAOfRowThree = checkForRowOfThree()

    if(
      squareBeingReplasedId && 
      validMove && 
      (isAOfColumnFour || isAOfRowFour || isAOfColumnThree || isAOfRowThree)) {
        setSquareBeingDragged(null)
        setSquareBeingReplased(null)
      } 
      else {
        currentColorArrangement[squareBeingReplasedId] = squareBeingReplased.style.backgroundColor
        currentColorArrangement[squareBeingDraggedId] = squareBeingDragged.style.backgroundColor
        setCurrentColorArrangement([...currentColorArrangement])
      }
  }

  

  useEffect(() => {
    createBoard()

  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      checkForColumnOfFour()
      checkForRowOfFour()
      checkForColumnOfThree()
      checkForRowOfThree()
      moveIntoSquareBelow()
      setCurrentColorArrangement([...currentColorArrangement])
    }, 100)
    return () => clearInterval(timer)
  }, [checkForColumnOfFour, checkForRowOfFour, checkForColumnOfThree, checkForRowOfThree, moveIntoSquareBelow, currentColorArrangement])
  
  console.log(currentColorArrangement);
  return (
    <div className="App">
      <div className="game">
        {
          currentColorArrangement.map((color, index) => (
            <img
              src={color}
              key={index}
              style={{backgroundColor: color}}
              alt={color}
              data-id={index}
              draggable={true}
              onDragStart={dragStart}
              onDragOver = {e => e.preventDefault()}
              onDragEnter = {e => e.preventDefault()}
              onDragLeave = {e => e.preventDefault()}
              onDrop={dragDrop}
              onDragEnd={dragEnd}
            />
          ))
        }
      </div>    
    </div>
  );
}

export default App;
