/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

const width = 8;

const candyColors = [
  'blue',
  'purple',
  'green',
  'yellow',
  'red',
  'black',
  'orange' 
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
        columnOfFour.forEach(square => currentColorArrangement[square] = '')
      }
    }
  }

  const checkForRowofFour = () => {
    for(let i=0; i < 64; i++) {
      const rowOfFour = [i, i+ 1, i + 2, i + 3]
      const decidedColors = currentColorArrangement[i]
      const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 62, 63, 64]
      if(!notValid.includes(i)) continue
      if (rowOfFour.every(square => currentColorArrangement[square] === decidedColors )) {
        rowOfFour.forEach(square => currentColorArrangement[square] = '')
      }
    }
  }

  const checkForColumnOfThree = () => {
    for(let i=0; i <= 47; i++) {
      const columnOfThree = [i, i+ width, i + width*2]
      const decidedColors = currentColorArrangement[i]
      if (columnOfThree.every(square => currentColorArrangement[square] === decidedColors )) {
        columnOfThree.forEach(square => currentColorArrangement[square] = '')
      }
    }
  }

  const checkForRowofThree = () => {
    for(let i=0; i < 64; i++) {
      const rowOfThree = [i, i+ 1, i + 2, i + 3]
      const decidedColors = currentColorArrangement[i]
      const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64]
      if(!notValid.includes(i)) continue
      if (rowOfThree.every(square => currentColorArrangement[square] === decidedColors )) {
        rowOfThree.forEach(square => currentColorArrangement[square] = '')
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
        currentColorArrangement[i] = ''
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
  }

  

  useEffect(() => {
    createBoard()

  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      checkForColumnOfFour()
      checkForRowofFour()
      checkForColumnOfThree()
      checkForRowofThree()
      moveIntoSquareBelow()
      setCurrentColorArrangement([...currentColorArrangement])
    }, 10000)
    return () => clearInterval(timer)
  }, [checkForColumnOfFour, checkForRowofFour, checkForColumnOfThree, checkForRowofThree, moveIntoSquareBelow, currentColorArrangement])
  
  console.log(currentColorArrangement);
  return (
    <div className="App">
      <div className="game">
        {
          currentColorArrangement.map((color, index) => (
            <img
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
