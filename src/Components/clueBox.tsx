import { useState } from 'react';
import { Select, MenuItem } from '@mui/material';
import { useGameContext } from '../Contexts/gameProvider';
import Game from '../Classes/game';
import SocketSender from '../Websocket/socketSender';
import { resetGameButton } from './resetButton';

export function clueBox() {
  const { game, mysocket } = useGameContext();
  const [clue, setclue] = useState('');
  const [clueCount, setclueCount] = useState(0);
  if (mysocket === undefined) {
    return null;
  }
  const sendClue = () => {
    mysocket.sendClue(clue, clueCount);
    setclue('');
    setclueCount(0);
  };

  //If game win condition then present winbox
  if (game.win !== '') {
    return winBox(game.playerCount, game.win);
  }

  const secondGuesserRole = game.playerCount === 2 ? 1 : 2;
  //If turn is 0 or 2 it is a clue-givers turn
  switch (game.turn) {
    case 0:
      if (game.role === 0)
        return clueInputBox(clue, setclue, clueCount, setclueCount, sendClue);
      return waitBox(game, 0);
    case 1:
      return lastClueBox(game, mysocket);
    case 2:
      if (game.role === secondGuesserRole)
        return clueInputBox(clue, setclue, clueCount, setclueCount, sendClue);
      return waitBox(game, secondGuesserRole);
    case 3:
      return lastClueBox(game, mysocket);
  }
}

function winBox(playerCount: number, win: string) {
  if (playerCount === 4) {
    return (
      <div className={`winbox winbox-${win}`}>{`${
        win.charAt(0).toUpperCase() + win.slice(1)
      } Team Wins!`}</div>
    );
  }
  if (win === 'win') {
    return (
      <div className="winbox">
        <div className="winbox-text">{`You Both Win!`}</div>;{resetGameButton()}
      </div>
    );
  }
  if (win === 'lose') {
    return (
      <div className="winbox">
        <div className="winbox-text">{`You Both Lose!`}</div>
        {resetGameButton(true)}
      </div>
    );
  }
}

function clueInputBox(
  clue: string,
  setclue: React.Dispatch<React.SetStateAction<string>>,
  clueCount: number,
  setclueCount: React.Dispatch<React.SetStateAction<number>>,
  sendClue: () => void
) {
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

function lastClueBox(game: Game, mysocket: SocketSender) {
  if (game.clues.length > 0) {
    const lastClue = game.clues[game.clues.length - 1];
    const yourturn =
      game.playerCount === 2
        ? game.turn + game.role === 3
        : game.turn === game.role;
    return (
      <div className="lastcluebox">
        {game.turn - 1 === 0
          ? playerCardPlain(game, lastClue.clueGiverIndex, 'red')
          : playerCardPlain(game, lastClue.clueGiverIndex, 'blue')}
        <div>gave the clue</div>
        <div className="guess guess--last">{lastClue.clueWord}</div>
        <div>{`to reveal ${lastClue.clueWordCount} words`}</div>
        {yourturn ? (
          <button className="endturnbox" onClick={() => mysocket.endTurn()}>
            End Turn
          </button>
        ) : (
          ''
        )}
      </div>
    );
  }
}

function waitBox(game: Game, clueGiverIndex: number) {
  const textPrompt =
    game.nicknames[clueGiverIndex] === '' ||
    game.nicknames[clueGiverIndex] === null
      ? 'Waiting for a clue from '
      : 'Awaiting player';
  if (game.playerCount === 4) {
    return (
      <div className="waitbox">{`${textPrompt}${
        game.nicknames[clueGiverIndex] && game.turn === 0
          ? 'Red Spymaster'
          : 'Blue Spymaster'
      }`}</div>
    );
  }
  if (game.playerCount === 2) {
    return (
      <div className="waitbox">{`${textPrompt}${game.nicknames[clueGiverIndex]}`}</div>
    );
  }
}

function playerCardPlain(game: Game, i: number, colour: string) {
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
