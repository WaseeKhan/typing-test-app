import { useEffect, useRef, useState } from "react";
import { generate } from "random-words";

const NUMB_OF_WORD = 200
const SECONDS = 60

function App() {
  const [words, setWords] = useState([])
  const [countDown, setCountDown] = useState([SECONDS])
  const [currInput, setCurrInput] = useState("")
  const [currWordIndex, setCurrWordIndex] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [currCharIndex, setCurrCharIndext] = useState(-1)
  const [currChar, setcurrChar] = useState("")
  const [incorrect, setIncorrect] = useState(0)
  const [status, setStatus] = useState("Waiting")
  const textInput = useRef(null)

  useEffect(() => {
    setWords(generateWords())
  }, [])


  useEffect(() => {
    if(status=='started')
    textInput.current.focus()
  }, [status])
  function generateWords(){
    return new Array(NUMB_OF_WORD).fill(null).map(() => generate())
  }
  function start(){
    if(status === 'finished'){
      setWords(generateWords())
      setCurrWordIndex(0)
      setCorrect(0)
      setIncorrect(0)
      setCurrCharIndext(-1)
      setcurrChar("")
    }

    if(status !== 'started')
      setStatus('started')
    let interval = setInterval(() => {
      setCountDown((prevCountDown) => {
        if(prevCountDown === 0){
          clearInterval(interval)
          setStatus('finished')
          setCurrInput("")
          return SECONDS

        } else{
          return prevCountDown -1
        }
        
      })
    },   1000)
  }
function handleKeyDown({keyCode, key}){
  //console.log(event.key)
  //Spacebar ===32
  if(keyCode ===32){
    checkMatch()
    setCurrInput("")
    setCurrWordIndex(currWordIndex + 1)
    setCurrCharIndext(-1)
    //Backspace == 8 
  }else if(keyCode===8){
    setCurrCharIndext(currCharIndex - 1)
    setcurrChar("")
  }
  
  else{
    setCurrCharIndext(currCharIndex + 1)
    setcurrChar(key)
  }
}
  

function checkMatch(){
  const wordToCompare = words[currWordIndex]
  const doesItMatch = wordToCompare===currInput.trim()
  // console.log({doesItMatch})
  if(doesItMatch){
    setCorrect(correct +1)
  }else{
    setIncorrect(incorrect + 1)
  }
}

function getCharClass(wordIdx, charIdx, char){
  if(wordIdx=== currWordIndex && charIdx === currCharIndex && currChar && status !== 'finished'){
    if(char===currChar){
      return 'has-background-success'
    }else{
      return 'has-background-danger'
    }
    }else if(wordIdx === currWordIndex && currCharIndex >= words[currWordIndex].length){
      return 'has-background-danger'
    }
    else{
      return ''
    }
}


  return (
    <div className="App">
      <div className="controle is-expaneded section">
        <div className="is-size-1 has-text-centered has-text-primary">
          <h1>{countDown}</h1>
        </div>
      </div>
      <div className="controle is-expaneded section">
        <input ref={textInput} disabled={status !== "started"} type="text" className="input"
         onKeyDown={handleKeyDown} 
         value={currInput} 
         onChange={(e)=> setCurrInput(e.target.value)}>

         </input>
      </div>

      <div className="section">
        <button className="button is-info is-fullwidth"
        onClick={start}>
           Start
        </button>
      </div>
      {status === 'started' && (

      


    <div className="section">
      <div className="card">
      <div className="card-content">
      <div className="content">
        {words.map((word, i) => (
          <span  key={i}>
          <span>
            {word.split("").map((char, idx) =>(
              <span className={getCharClass(i, idx, char)} key={idx}>{char}</span>
            ))}
          </span>
          <span> </span>
          </span>
          // <>
          // <span>
          //   {word}
          // </span>
          // <span> </span>
          // </>
        ))}
        </div>
        </div>
      </div>
    </div>
    )}

    {status === 'finished' && (

    
    <div className="section">
      <div className="columns">
      <div className="column has-text-centered">
        <p className="is-size-5">WPM: </p>
        <p className="has-text-primary is-size-1">
          {correct}
        </p>
      </div>
      <div className="column has-text-centered">
      <p className="is-size-5">ACCURACY: </p>
      <p className="has-text-primary is-size-1">
          {Math.round((correct / (correct + incorrect)) * 100)} %
        </p>
      </div>
      </div>
    </div>
    )}
    </div>
  );
}

export default App;
