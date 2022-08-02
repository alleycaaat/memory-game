const CardDeck = ({value, flipped, match, clicked, card}) => {

    return (
        <button
            className={
                (flipped ? 'animate card' : 'card') +
                (match ? 'match' : '')
            }
            card={card}
            value={value}
            onClick={()=>clicked(card)}
            disabled={match}
        >
            <img
            alt='cardface'
                className='back'
                src={`https://achulslander.com/img/memory/${value}.svg`}
            />
        </button>
    );
};

export default CardDeck;
