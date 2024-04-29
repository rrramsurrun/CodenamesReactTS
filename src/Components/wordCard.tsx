import { useGameContext } from '../contextProvider';

export function wordCard(i: number) {
  const { game, mysocket } = useGameContext();
  let clickable = false;
  let revealedToggle = 'unrevealed';
  let codexcolor = '';
  const word = game.words[i];
  let leftcolor;
  let rightcolor;
  let finalcolor;

  if (game.playerCount === 4) {
    clickable = game.role % 2 === 1 && game.turn === game.role ? true : false;

    if (game.codex) {
      // @ts-ignore
      const colorFromCodex = game.codex[word.toLowerCase()];
      codexcolor =
        // @ts-ignore
        colorFromCodex === 'black'
          ? 'black'
          : // @ts-ignore
            `light-${colorFromCodex}`;
    }
    if (game.revealed[i] !== null && game.revealed[i] !== undefined) {
      clickable = false;
      revealedToggle = 'revealed';
    }
    if (game.win !== null) {
      clickable = false;
    }
    //In a 4-player game the revealed word overrules the codex
    finalcolor = game.revealed[i] ?? codexcolor;
    return singleColorCard(i, word, clickable, finalcolor, revealedToggle);
  }

  if (game.playerCount === 2 && game.win === null) {
    //Default a card to clickable, amend later
    clickable = game.turn + game.role === 3 ? true : false;

    //Use a lighter shade for your own codex
    if (game.codex) {
      codexcolor =
        // @ts-ignore
        game.codex[word] === 'black' ? 'black' : `light-${game.codex[word]}`;
    }
    //If there is a non-null value for a word, it has been revealed on one or both sides
    if (game.revealed[i] !== null && game.revealed[i] !== undefined) {
      leftcolor =
        game.revealed[i][0] === undefined ? null : game.revealed[i][0];
      rightcolor =
        game.revealed[i][1] === undefined ? null : game.revealed[i][1];
    }
    // const splitcolor =
    //   game.role === 0
    //     ? `${codexcolor}-${revealcolor}`
    //     : `${revealcolor}-${codexcolor}`;

    if (leftcolor === 'green' || rightcolor === 'green') {
      //If a card is revealed as green for either side, it is green for both
      finalcolor = 'green';
      clickable = false;
      revealedToggle = 'revealed';
    } else if (leftcolor === 'cream' && rightcolor === null) {
      //Right player has clicked on a word that was cream in the left's codex
      //Left player has not clicked this word
      //Right player can no longer click it, the right one can
      //If a card is revealed as cream, it lies partially over your own colour
      if (game.role === 2) {
        return splitColorCard(
          i,
          word,
          false,
          false,
          'cream revealed',
          codexcolor
        );
      } else {
        return splitColorCard(
          i,
          word,
          clickable,
          false,
          codexcolor,
          'cream revealed'
        );
      }
    } else if (leftcolor === null && rightcolor === 'cream') {
      //left player has clicked on a word that was cream in the right's codex
      //right player has not clicked this word
      //left player can no longer click it, the left one can
      clickable = game.role === 0 ? false : true;
      //If a card is revealed as cream, it lies partially over your own colour
      if (game.role === 0) {
        //The left player cannot click, but sees their codex underneath
        return splitColorCard(
          i,
          word,
          false,
          false,
          codexcolor,
          'cream revealed'
        );
      } else {
        //The right player will see cream overlaying their codex color
        return splitColorCard(
          i,
          word,
          false,
          clickable,
          'cream revealed',
          codexcolor
        );
      }
    } else if (leftcolor === 'cream' && rightcolor === 'cream') {
      return singleColorCard(i, word, false, 'cream', 'revealed');
    }
  }

  if (game.playerCount === 2 && game.win !== null) {
    //In a 2 player game the revealed is full populated at the end of the game
    return splitColorCard(
      i,
      word,
      false,
      false,
      game.revealed[i][0],
      game.revealed[i][1]
    );
  }

  return singleColorCard(
    i,
    word,
    clickable,
    finalcolor ?? codexcolor,
    revealedToggle
  );
}

export function splitColorCard(
  i: number,
  word: string,
  leftclickable: boolean,
  rightclickable: boolean,
  leftcolor: string,
  rightcolor: string
) {
  const { mysocket } = useGameContext();
  return (
    <div className={`wordcard--split`}>
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
  i: number,
  word: string,
  clickable: boolean,
  finalcolor: string,
  revealedToggle: string
) {
  const { game, mysocket } = useGameContext();
  return (
    <button
      key={`word ${i}`}
      // codex present means matrix visible, all cards colored.
      // revealed words also colored
      className={`wordcard ${
        clickable ? 'clickable' : ''
      } wordcard--${finalcolor} ${
        game.win === null ? '' : 'wordcard--end'
      }${revealedToggle}`}
      onClick={clickable ? () => mysocket?.clickWord(i) : undefined}
    >
      {word}
    </button>
  );
}
