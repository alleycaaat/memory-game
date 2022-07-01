import { useState,useEffect,useRef } from 'react';
import CardDeck from './CardDeck';
import './style.css';

function App() {
  let cardArr = [
    "javascript",
    "react",
    "html5",
    "babel",
    "redux",
    "python",
    "angular",
    "ruby",
    "sass",
    "cplusplus",
    "css3",
    "django",
    "node",
    "java",
    "ts",
  ];
  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(false);
  const [timer, setTimer] = useState(0);
  const [deckAmt, setDeckAmt] = useState([]);
  const [finalDeck, setfinalDeck] = useState([]);
  const [cards, setCards] = useState([...finalDeck]);
  const [picked, setPicked] = useState([]);
  let dup = [...cards];

  const tick = useRef(null);
  useEffect(() => {
    if (running) {
      tick.current = setInterval(() => {
        setTimer((timer) => timer + 1);
      }, 1000);
    }
    return () => clearInterval(tick.current); //clear on unmount
  });

  //////////game difficulty
  const cardCount = (e) => {
    let count = e.target.value;
    //if difficulty is changed mid-game, stop and reset the timer
    setRunning(false);
    clearInterval(tick.current);
    setTimer(0);
    //need to set finalDeck to an empty array, or the new cards will just be added to the deck already onscreen
    setfinalDeck([]);
    let shuffled = [...cardArr].sort(() => Math.random() - 0.5); //shuffle original array, slice out count
    var selected = shuffled.slice(0, count);
    setDeckAmt(selected);
  };

  //////////reset button
  //reset the game by setting cards and finalDeck to an empty array, stop and reset timer
  const reset = () => {
    setCards([]);
    setfinalDeck([]);
    setRunning(false);
    setTimer(0);
  };

  //////////start button
  //start timer, double the deck then shuffle it
  const start = () => {
    setRunning(true);
    let doubled = deckAmt.concat(deckAmt);
    let shuffle = [...doubled].sort(() => Math.random() - 0.5);
    shuffle.map((name, index) => {
      finalDeck.push({
        name,
        flip: false,
        match: false,
      });
      return finalDeck;
    });
    setfinalDeck(finalDeck);
    setCards(finalDeck);
  };

  //////////check for match
  //check for a match, if they match, set it to true so the cards are disabled.  if not a match, set flip to false so they turn back over and incriment the score
  const check = () => {
    let scored = [score];
    let match = picked[0].name === picked[1].name;

    if (match) {
      setCards(dup);
      setPicked([]);
    } else {
      dup[picked[0].index].flip = false;
      dup[picked[0].index].match = false;
      dup[picked[1].index].flip = false;
      dup[picked[1].index].match = false;
      setScore((scored) => scored + 1);
      setCards(dup);
      setPicked([]);
    }
  };

  //////////card clicked
  //when a card is clicked, if the picked array length is two, check cards.  if not, flip card, push card to picked array, recheck picked array length.
  const clicked = (e, name, index) => {
    if (picked.length === 2) {
      setTimeout(() => {
        check();
      }, 750);
    }

    dup[index].flip = true;
    dup[index].match = true;
    setCards(dup);
    picked.push({ name, index });
    setPicked(picked);
    if (picked.length === 2) {
      setTimeout(() => {
        check();
      }, 750);
    }
  };

  return (
    <div className='wrapper'>
      <div className='heading'>
        <h1>Memory Game</h1>
        <h2>Select your difficulty, then press start</h2>
      </div>
      <div className='top'>
        <button className='option' value='5' onClick={cardCount}>
          Easy
        </button>
        <button className='option' value='10' onClick={cardCount}>
          Medium
        </button>
        <button className='option' value='15' onClick={cardCount}>
          Difficult
        </button>
      </div>
      <div>
        <button className='option' onClick={start}>
          Start
        </button>
        <button className='option' onClick={reset}>
          Reset
        </button>
      </div>
      <div className='bottom'>
        <div className='display'>
          {timer}
          {timer === 1 ? ' second' : ' seconds'}
        </div>
        <div className='display'>
          {score}
          {score === 1 ? ' incorrent guess' : ' incorrect guesses'}
        </div>
      </div>
      <div className='cardHolder'>
        {cards.map((card, index) => (
          <CardDeck
            value={card.name}
            index={index}
            flipped={card.flip}
            match={card.match}
            click={(e) => {
              clicked(card, card.name, index);
            }}
          ></CardDeck>
        ))}
      </div>
      <div className='credit'>
        <p>
          Created by
          <a href='https://achulslander.com/' target='_blank' rel='noreferrer'>
            AC Hulslander
          </a>
        </p>
        <p>
          <a href='https://codepen.io/alleycaaat/pens/public' target='_blank' rel='noreferrer'>
            See my other pens
          </a>
        </p>
        <p class='smol'>
          All isons are from
          <a target='_blank' href='https://icons8.com' rel='noreferrer'>
            Icons8
          </a>
        </p>
      </div>
    </div>
  );
}

export default App;
