const CardDeck = (props) => {
  return (
    <button
      className={
        (props.flipped ? "animate card" : "card") + (props.match ? "match" : "")
      }
      value={props.value}
      onClick={props.click}
      disabled={props.match}
    >
      <img
        className='back'
        alt='purple card'
        src={"https://achulslander.com/img/memory/" + props.value + ".svg"}
      />
    </button>
  );
};

export default CardDeck;
