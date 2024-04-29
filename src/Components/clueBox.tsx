import { useState } from 'react';
import { Select, MenuItem, Box } from '@mui/material';
import { useGameContext } from '../contextProvider';

function winBox() {
  const { game, mysocket } = useGameContext();
  if (game.playerCount === 4) {
    return (
      <div className={`winbox winbox-${game.win}`}>{`${
        game.win.charAt(0).toUpperCase() + game.win.slice(1)
      } Team Wins!`}</div>
    );
  }
  if (game.win === 'win') {
    return <div className={`winbox`}>{`You Both Win!`}</div>;
  }
  if (game.win === 'lose') {
    return <div className={`winbox`}>{`You Both Lose!`}</div>;
  }
}
function clueInputBox() {
  const [clue, setclue] = useState('');
  const [clueCount, setclueCount] = useState(0);
  const { game, mysocket } = useGameContext();
  const sendClue = () => {
    mysocket?.sendClue(clue, clueCount);
    setclue('');
    setclueCount(0);
  };

  return (
    <div className="clueInput">
      <div className="clueInputSpacer">Your one word clue:</div>
      <input
        className="clueInputBox"
        type="text"
        placeholder="Enter your clue here"
        value={clue}
        onChange={(e) => setclue(e.target.value)}
      />
      <div className="clueInputSpacer">to find</div>
      <Select
        className="clueCountDD"
        label="clueCountDD"
        value={clueCount}
        onChange={(e) => setclueCount(Number(e.target.value))}
      >
        {[...Array(9).keys()].map((e) => (
          <MenuItem key={`item ${e}`} value={e}>
            {e}
          </MenuItem>
        ))}
      </Select>
      <div className="clueInputSpacer">words</div>
      <button
        className="clueInputSubmit"
        disabled={!clue}
        onClick={() => sendClue()}
      >
        Submit
      </button>
    </div>
  );
}

function lastClueBox() {
  const { game, mysocket } = useGameContext();
  if (game.clues.length > 0) {
    const lastClue = game.clues[game.clues.length - 1];
    const yourturn =
      game.playerCount === 2
        ? game.turn + game.role === 3
        : game.turn === game.role;
    return (
      <div className="lastcluebox">
        {game.turn - 1 === 0
          ? playerCardPlain(lastClue.clueGiverIndex, 'red')
          : playerCardPlain(lastClue.clueGiverIndex, 'blue')}
        <div>gave the clue</div>
        <div className="guess guess--last">{lastClue.clueWord}</div>
        <div>{`to reveal ${lastClue.clueWordCount} words`}</div>
        {yourturn ? (
          <button className="endturnbox" onClick={() => mysocket?.endTurn()}>
            End Turn
          </button>
        ) : (
          ''
        )}
      </div>
    );
  }
}

function waitBox() {
  const { game, mysocket } = useGameContext();
  if (game.playerCount === 4) {
    return (
      <div className="waitbox">{`Waiting for a clue from ${
        game.nicknames[game.turn] && game.turn === 0
          ? 'Red Spymaster'
          : 'Blue Spymaster'
      }`}</div>
    );
  }
  if (game.playerCount === 2) {
    return (
      <div className="waitbox">{`Waiting for a clue from ${
        game.nicknames[game.turn]
      }`}</div>
    );
  }
}

export function clueBox() {
  const { game, mysocket } = useGameContext();

  //If game win condition then present winbox
  if (game.win !== '') {
    return winBox();
  }
  //If turn is 0 or 2 it is time for a clue
  if (game.turn % 2 === 0) {
    if (game.role % 2 === 0 && game.turn === game.role) {
      return clueInputBox();
    } else {
      return waitBox();
    }
  }
  //If turn is 1 or 3 it is guess time (for thee)
  if (game.turn % 2 !== 0) {
    return lastClueBox();
  }
}

function playerCardPlain(i: number, colour: string) {
  const { game, mysocket } = useGameContext();
  if (game.playerCount === 2) {
    colour = 'green';
  }
  return (
    <div className={`playerdetails-plain players-${colour}`}>
      <div className={`playertitle playertitle-${colour}`}>
        {game.playerCount === 2
          ? 'Spy'
          : i % 2 === 0
          ? 'Spymaster'
          : 'Operative'}
      </div>
      <div className={'playername'}>
        {game.nicknames[i] ? `${game.nicknames[i]}` : 'Awaiting player'}
      </div>
    </div>
  );
}
