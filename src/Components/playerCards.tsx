import { useEffect, useState } from 'react';
import { useGameContext } from '../Contexts/gameProvider';
import { IconLogout } from '@tabler/icons-react';

export function playersBox(colour: string) {
  if (colour === 'left' || colour === 'right') {
    return (
      <div className="players players-green">
        {playerCard(colour === 'left' ? 0 : 1, 'green')}
      </div>
    );
  }
  const firstPlayer = colour === 'red' ? 0 : 2;
  return (
    <div className={`players players-${colour}`}>
      {playerCard(firstPlayer, colour)}
      {playerCard(firstPlayer + 1, colour)}
      {cluecountCard(colour)}
    </div>
  );
}

function playerCard(i: number, colour: string) {
  const { game } = useGameContext();
  const playerTitle =
    game.playerCount === 2 ? 'Spy' : i % 2 === 0 ? 'Spymaster' : 'Operative';
  return (
    <div className={`playercard ${game.turn === i ? 'playercard-turn' : ''}`}>
      <div className={`playerdetails`}>
        <div className={`playertitle playertitle-${colour}`}>{playerTitle}</div>
        <div className={'playername'}>
          {game.nicknames[i] ? `${game.nicknames[i]}` : 'Awaiting player'}
        </div>
      </div>
      {game.role === i ? leaveGameButton(colour) : null}
    </div>
  );
}

function leaveGameButton(colour: string) {
  const { game, mysocket } = useGameContext();
  const [leaveGameConfirm, setleaveGameConfirm] = useState(false);
  //Leave game requires 2 clicks, after 1 click wait 10s before resetting
  useEffect(() => {
    if (leaveGameConfirm) {
      setTimeout(() => {
        setleaveGameConfirm(false);
      }, 10000);
    }
  }, [leaveGameConfirm]);

  if (leaveGameConfirm) {
    let warningMsg;
    if (game.nicknames.filter((name) => name !== null).length === 1) {
      warningMsg = 'End this game?';
    } else {
      warningMsg = 'Leave this game?';
    }
    return (
      <div className="leavegamebox">
        <div className="leavegamemsg">{warningMsg}</div>
        <IconLogout
          className={`confirmexitbutton playertitle-${colour}`}
          onClick={() => mysocket?.leaveGame()}
        />
      </div>
    );
  } else {
    return (
      <IconLogout
        className={`exitbutton playertitle-${colour}`}
        onClick={() => setleaveGameConfirm(true)}
      />
    );
  }
}
function cluecountCard(colour: string) {
  const { game } = useGameContext();
  let total;
  let guessed;
  if (game.firstTurn === 'red') {
    total = colour === 'red' ? 9 : 8;
  } else {
    total = colour === 'red' ? 8 : 9;
  }

  if (game.revealed.length === 0) {
    guessed = 0;
  } else {
    guessed = game.revealed.filter((arr) => arr === colour).length;
  }
  return <div className={`cluecounter`}>{`${total - guessed} words left`}</div>;
}
