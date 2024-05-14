import Game from '../Classes/game';
import SocketSender from '../Websocket/socketSender';

export function wordCard(game: Game, mysocket: SocketSender, i: number) {
  const word = game.words[i];

  if (game.playerCount === 4) {
    return fourPlayerWordCard(game, mysocket, i, word);
  }
  //PlayerCount is now always 2
  if (game.win !== '') {
    return twoPlayerWordCardEnd(game, mysocket, i, word);
  }

  return twoPlayerWordCard(game, mysocket, i, word);
}

function twoPlayerWordCard(
  game: Game,
  mysocket: SocketSender,
  wordIndex: number,
  word: string
) {
  /*Colors in codex/guessed colors are: black,cream, green
    Codex colors are: black, light-cream, light-green*/
  let clickable = false;
  let revealedToggle = 'unrevealed';
  let codexcolor = '';
  let leftcolor = '';
  let rightcolor = '';

  //Set default clickable if it is the player's turn to guess
  if (game.role === 0) {
    clickable = game.turn === 3 ? true : false;
  } else {
    //game.role===1
    clickable = game.turn === 1 ? true : false;
  }

  // @ts-ignore
  codexcolor = game.codex[word.toLowerCase()];
  //Use a lighter shade for your own codex
  if (game.codex) {
    codexcolor = codexcolor === 'black' ? 'black' : `light-${codexcolor}`;
  }

  //If there is a non-null value for a word, it has been revealed on one or both sides
  if (game.revealed[wordIndex] !== '') {
    leftcolor =
      game.revealed[wordIndex][0] === '' ? '' : game.revealed[wordIndex][0];
    rightcolor =
      game.revealed[wordIndex][1] === '' ? '' : game.revealed[wordIndex][1];
  }

  switch (`${leftcolor}-${rightcolor}`) {
    case 'green-green':
      clickable = false;
      revealedToggle = 'revealed';
      return singleColorCard(
        game,
        mysocket,
        wordIndex,
        word,
        false,
        'green',
        revealedToggle
      );
    case 'cream-':
      //
      //Right player (1) has clicked on a word that was cream in the left's codex
      //Left player (0) has not clicked this word
      //Right player can no longer click it, the left one can if it is their turn
      //If a card is revealed as cream, it lies partially over your own colour
      if (game.role === 1) clickable = false;
      return splitColorCard(
        mysocket,
        wordIndex,
        word,
        clickable,
        false,
        'cream revealed',
        codexcolor
      );

    case '-cream':
      if (game.role === 0) clickable = false;
      return splitColorCard(
        mysocket,
        wordIndex,
        word,
        clickable,
        false,
        codexcolor,
        'cream revealed'
      );
    case 'cream-cream':
      return singleColorCard(
        game,
        mysocket,
        wordIndex,
        word,
        false,
        'cream',
        'revealed'
      );
    case '-':
      return singleColorCard(
        game,
        mysocket,
        wordIndex,
        word,
        clickable,
        codexcolor,
        ''
      );
  }
}

function twoPlayerWordCardEnd(
  game: Game,
  mysocket: SocketSender,
  i: number,
  word: string
) {
  //In a 2 player game the revealed is full populated at the end of the game
  return splitColorCard(
    mysocket,
    i,
    word,
    false,
    false,
    game.revealed[i][0],
    game.revealed[i][1]
  );
}

function fourPlayerWordCard(
  game: Game,
  mysocket: SocketSender,
  i: number,
  word: string
) {
  let clickable = false;
  let revealedToggle = 'unrevealed';
  let codexcolor = '';
  let finalcolor;
  clickable = game.role % 2 === 1 && game.turn === game.role ? true : false;

  if (game.role % 2 === 0) {
    // @ts-ignore
    const colorFromCodex = game.codex[word.toLowerCase()];
    codexcolor =
      // @ts-ignore
      colorFromCodex === 'black'
        ? 'black'
        : // @ts-ignore
          `light-${colorFromCodex}`;
  } else {
    codexcolor = 'cream';
  }
  if (game.revealed[i] !== '') {
    clickable = false;
    revealedToggle = 'revealed';
  }
  if (game.win !== '') {
    clickable = false;
  }
  //In a 4-player game the revealed word overrules the codex
  finalcolor = game.revealed[i] !== '' ? game.revealed[i] : codexcolor;
  return singleColorCard(
    game,
    mysocket,
    i,
    word,
    clickable,
    finalcolor,
    revealedToggle
  );
}

export function splitColorCard(
  mysocket: SocketSender,
  i: number,
  word: string,
  leftclickable: boolean,
  rightclickable: boolean,
  leftcolor: string,
  rightcolor: string
) {
  return (
    <div key={`word ${i}-card`} className={`wordcard--split`}>
      <button
        key={`word ${i}-left`}
        // codex present means matrix visible, all cards colored.
        // revealed words also colored
        className={`wordcard__half wordcard__half--left ${
          leftclickable ? 'clickable' : ''
        } wordcard--${leftcolor}`}
        onClick={leftclickable ? () => mysocket?.clickWord(i) : undefined}
      />
      <span
        key={`word ${i}-middle`}
        className={`wordcard--split__word ${
          leftcolor === 'black' || rightcolor === 'black'
            ? 'wordcard--split__word--whitetext'
            : ''
        }`}
      >
        {word}
      </span>
      <button
        key={`word ${i}-right`}
        // codex present means matrix visible, all cards colored.
        // revealed words also colored
        className={`wordcard__half wordcard__half--right ${
          rightclickable ? 'clickable' : ''
        } wordcard--${rightcolor}`}
        onClick={rightclickable ? () => mysocket?.clickWord(i) : undefined}
      />
    </div>
  );
}
export function singleColorCard(
  game: Game,
  mysocket: SocketSender,
  i: number,
  word: string,
  clickable: boolean,
  finalcolor: string,
  revealedToggle: string
) {
  return (
    <button
      key={`word ${i}`}
      // codex present means matrix visible, all cards colored.
      // revealed words also colored
      className={`wordcard ${
        clickable ? 'clickable' : ''
      } wordcard--${finalcolor} ${
        game.win === '' ? '' : 'wordcard--end'
      } ${revealedToggle}`}
      onClick={clickable ? () => mysocket?.clickWord(i) : undefined}
    >
      {word}
    </button>
  );
}
