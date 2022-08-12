import { useState, useEffect, useRef } from 'react';
import api from './api';
import CardDeck from './components/CardDeck';
import './style.css';

function App() {
    const [orgCards, setOrgCards] = useState([]); //original starting card deck from server
    const [shuffled, setShuffled] = useState([]); //shuffled deck
    const [finalDeck, setfinalDeck] = useState([]); //shuffled and counted cards
    const [picked, setPicked] = useState([]); //holds picked cards
    const [dup, setDup] = useState([]); //duplicate finalDeck to easier match comparison

    const [score, setScore] = useState(0);
    const [running, setRunning] = useState(false);
    const [timer, setTimer] = useState(0);
    const [matches, setMatches] = useState(0);
    const [count, setCount] = useState(0);
    const [display, setDisplay] = useState('');
    const tick = useRef(null);

    //start things up on render
    useEffect(() => {
        startUp();
    }, []);

    //gets the cards from fauna
    const startUp = async () => {
        await api
            .getall()
            .then((cards) => {
                let namedcards = [];
                cards.map((card) => {
                    namedcards.push({
                        name: card.data.name,
                    });
                    return namedcards;
                });
                setOrgCards(namedcards);
            })
            .catch((err) => {
                console.log('error ', err);
            });
    };

    //handles timer
    useEffect(() => {
        if (running) {
            tick.current = setInterval(() => {
                setTimer((timer) => timer + 1);
            }, 1000);
        }
        return () => clearInterval(tick.current); //clear on unmount
    });

    //handles difficulty seelection
    const cardCount = (e) => {
        //if difficulty is changed mid-game, reset game
        reset();
        clearInterval(tick.current);
        //if error message present, remove
        setDisplay('');
        let count = e.target.value;
        let temp = [];
        let counted;
        setCount(count);

        temp = [...orgCards].sort(() => Math.random() - 0.5); //shuffle all cards of original array
        counted = temp.slice(0, count); //get correct amount of cards
        setShuffled(counted);
    };

    //reset errything
    const reset = () => {
        setScore(0);
        setTimer(0);
        setCount(0)
        setDisplay();
        setMatches(0);
        setShuffled([]);
        setfinalDeck([]);
        setRunning(false);
    };

    //start timer, double card amount, deal
    const start = () => {
        if(count === 0) {
           return setDisplay('Please select a difficulty')
        }
        setRunning(true);
        let deck = [];
        //double the deck then shuffle the cards
        let doubled = shuffled.concat(shuffled);
        doubled.sort(() => Math.random() - 0.5);

        doubled.map((card, i) => {
            deck.push({
                name: card.name,
                index: i,
                flipped: false,
                match: false,
            });
            return deck;
        });
        setfinalDeck(deck);
        setDup(deck);
    };

    //handles game being won/over
    const gameOver = () => {
        if (matches === count - 1) {
            setRunning(false);
            setDisplay('You won!');
        }
    };

    //check if the cards match
    const check = () => {
        let match = picked[0].name === picked[1].name;

        if (match) {
            setfinalDeck(dup);
            setPicked([]);
            setMatches((matches) => matches + 1);
            gameOver();
        } else {
            setTimeout(() => {
                dup[picked[0].index].flipped = false;
                dup[picked[1].index].flipped = false;
                dup[picked[0].index].match = false;
                dup[picked[1].index].match = false;
            }, 650);

            setScore((score) => score + 1);
            setfinalDeck(dup);
            setPicked([]);
        }
    };

    //handles card selections
    const clicked = (card) => {
        let index = card.index;
        let name = card.name;

        if (picked.length === 2) {
            setTimeout(() => {
                check();
            }, 750);
        }
        //optimistically set flipped and match to true
        dup[index].flipped = true;
        dup[index].match = true;
        setDup(dup);

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
                <button className='option' value={5} onClick={cardCount}>
                    Easy
                </button>
                <button className='option' value={10} onClick={cardCount}>
                    Medium
                </button>
                <button className='option' value={15} onClick={cardCount}>
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
                    {score === 1 ? ' incorrect guess' : ' incorrect guesses'}
                </div>
            </div>
            <div className='display msg'>{display}</div>
            <div className='cardHolder'>
                {finalDeck.map((card, i) => (
                    <div key={i}>
                        <CardDeck
                            index={i}
                            card={card}
                            flipped={card.flipped}
                            match={card.match}
                            value={card.name}
                            clicked={clicked}
                        ></CardDeck>
                    </div>
                ))}
            </div>
            <div className='credit'>
                <p>
                    Created by{' '}
                    <a
                        href='https://achulslander.com/'
                        target='_blank'
                        rel='noreferrer'
                    >
                        AC Hulslander
                    </a>
                </p>
                <p>
                    <a
                        href='https://github.com/alleycaaat/memory-game'
                        target='_blank'
                        rel='noreferrer noopener'
                    >
                        View this project on GitHub
                    </a>
                </p>
                <p>
                    <a
                        href='https://codepen.io/alleycaaat/pens/public'
                        target='_blank'
                        rel='noreferrer'
                    >
                        See my pens
                    </a>
                </p>
                <p className='smol'>
                    All icons are from{' '}
                    <a
                        target='_blank'
                        href='https://icons8.com'
                        rel='noreferrer'
                    >
                        Icons8
                    </a>
                </p>
            </div>
        </div>
    );
}

export default App;
