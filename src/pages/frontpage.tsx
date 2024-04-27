import React, { useState, useEffect } from 'react';
import SocketSender from '../Websocket/socketSender';
import Game, { GameStatus } from '../Classes/game';
import { GameReducerAction } from '../Websocket/gameReducer';
// import ReactDOM from "react-dom";

type FrontPageProps = {
  mysocket: SocketSender;
  game: Game;
  errormsg: string;
  setGame: React.Dispatch<GameReducerAction>;
};

export default function FrontPage({
  mysocket,
  game,
  errormsg,
  setGame,
}: FrontPageProps) {
  const [status, setStatus] = useState(game.gameStatus);
  const [room, setroom] = useState('');
  const [tempnickname, settempnickname] = useState('');
  const [temprole, settemprole] = useState('');
  const [playercount, setplayercount] = useState(4);
  useEffect(() => {
    setStatus(game.gameStatus);
  }, [game]);

  const submitRequest = () => {
    switch (status) {
      case GameStatus.FRONTPAGE_NEW:
        mysocket.newGame(temprole, tempnickname, playercount);
        break;
      case GameStatus.FRONTPAGE_FIND:
        const cleanedRoom = room.includes('roomname=')
          ? room.slice(room.indexOf('roomname=') + 9)
          : room;
        setroom(cleanedRoom);
        mysocket.findGame(cleanedRoom);
        break;
      case GameStatus.FRONTPAGE_SELECT:
        mysocket.joinGame(game.gameId, temprole, tempnickname);
        break;
      default:
        console.log('Game Status error');
    }
  };

  const selectPlayer = (colour: string, role: string) => {
    const buttonRole = colour + ' ' + role;
    return (
      <button
        className={`usercard usercard--${colour} ${
          buttonRole === temprole ? 'selected' : ''
        }`}
        onClick={() => settemprole(buttonRole)}
      >
        {role}
      </button>
    );
  };
  const selectedPlayer = (nickname: string, colour: string, role: string) => {
    // const buttonRole = colour + " " + role;
    return (
      <div className={`usercard usercard--${colour}`}>
        <div className={`playertitle playertitle-${colour}`}>{role}</div>
        <div className={'playername'}>{nickname}</div>
      </div>
    );
  };
  const userRoles = (nicknames: string[], pc: number) => {
    if (nicknames.length > 0) {
      if (pc === 2) {
        return (
          <div className="userroles">
            <div className="select-player-column">
              {nicknames[0] !== null
                ? selectedPlayer(nicknames[0], 'green', 'Your co-conspirator')
                : ''}
              {nicknames[1] !== null
                ? selectedPlayer(nicknames[1], 'green', 'Your co-conspirator')
                : ''}
            </div>
          </div>
        );
      }
      //Otherwise pc===4
      return (
        <div className="userroles">
          <div className="select-player-column">
            {nicknames[0] !== null
              ? selectedPlayer(nicknames[0], 'red', 'Spymaster')
              : selectPlayer('red', 'Spymaster')}
            {nicknames[1] !== null
              ? selectedPlayer(nicknames[1], 'red', 'Operative')
              : selectPlayer('red', 'Operative')}
          </div>
          <div className="select-player-column">
            {nicknames[2] !== null
              ? selectedPlayer(nicknames[2], 'blue', 'Spymaster')
              : selectPlayer('blue', 'Spymaster')}
            {nicknames[3] !== null
              ? selectedPlayer(nicknames[3], 'blue', 'Operative')
              : selectPlayer('blue', 'Operative')}
          </div>
        </div>
      );
    }

    if (pc === 4) {
      return (
        <div className="userroles">
          <div className="select-player-column">
            {selectPlayer('red', 'Spymaster')}
            {selectPlayer('red', 'Operative')}
          </div>
          <div className="select-player-column">
            {selectPlayer('blue', 'Spymaster')}
            {selectPlayer('blue', 'Operative')}
          </div>
        </div>
      );
    }
  };

  if (status === GameStatus.FRONTPAGE_SELECT) {
    return (
      <div className="frontpage">
        <div className="title">Codenames</div>
        <div className="introbuttons">
          <input
            className="nameinput"
            placeholder="Username"
            onChange={(e) => settempnickname(e.target.value)}
            key="nameinput"
          />
          {userRoles(game.nicknames, game.playerCount)}

          <button
            type="button"
            className="frontbutton"
            disabled={
              tempnickname === '' || (temprole === '' && game.playerCount === 4)
            }
            onClick={submitRequest}
          >
            Join Game
          </button>
          <button
            className="frontbutton"
            onClick={() => setGame({ type: 'CANCELJOIN_GAME' })}
          >
            Cancel join
          </button>
          {errormsg ? <div>{errormsg}</div> : ''}
        </div>
      </div>
    );
  }

  if (status === GameStatus.FRONTPAGE_NEW) {
    return (
      <div className="frontpage">
        <div className="title">Codenames</div>
        <div className="introbuttons">
          <div className="introbuttons__row">
            <button
              className={`frontbutton ${
                playercount === 4 ? 'frontbutton--red' : ''
              }`}
              onClick={() => setplayercount(4)}
            >
              4-player
            </button>
            <button
              className={`frontbutton ${
                playercount === 2 ? 'frontbutton--green' : ''
              }`}
              onClick={() => setplayercount(2)}
            >
              2-player
            </button>
          </div>
          <input
            className="nameinput"
            placeholder="Username"
            onChange={(e) => settempnickname(e.target.value)}
          />
          {userRoles([], playercount)}
          <button
            className="frontbutton"
            type="button"
            disabled={
              tempnickname === '' || (temprole === '' && playercount === 4)
            }
            onClick={submitRequest}
          >
            {`Create ${playercount}-player game`}
          </button>

          {errormsg ? <div>{errormsg}</div> : ''}

          <button
            className="frontbutton"
            onClick={() =>
              setGame({
                type: 'CHANGE_STATUS',
                payload: GameStatus.FRONTPAGE_FIND,
              })
            }
          >
            Join Game Instead
          </button>
        </div>
      </div>
    );
  }

  if (status === GameStatus.FRONTPAGE_FIND) {
    return (
      <div className="frontpage">
        <div className="title">Codenames</div>
        <div className="introbuttons">
          <input
            className="nameinput"
            placeholder="Room Name"
            onChange={(e) => setroom(e.target.value)}
            key="roomname"
          />

          <button
            className="frontbutton"
            type="button"
            disabled={!room}
            onClick={submitRequest}
          >
            Find game
          </button>

          {errormsg ? <div>{errormsg}</div> : ''}
          <button
            className="frontbutton"
            onClick={() =>
              setGame({
                type: 'CHANGE_STATUS',
                payload: GameStatus.FRONTPAGE_NEW,
              })
            }
          >
            Create game instead
          </button>
        </div>
      </div>
    );
  }

  //before user has selected create vs join
  if (status === GameStatus.FRONTPAGE_START) {
    return (
      <div className="frontpage">
        <div className="title">Codenames</div>
        <div className="introbuttons">
          <div className="introbuttons__row">
            <button
              className={`frontbutton ${
                playercount === 4 ? 'frontbutton--red' : ''
              }`}
              onClick={() => setplayercount(4)}
            >
              4-player
            </button>
            <button
              className={`frontbutton ${
                playercount === 2 ? 'frontbutton--green' : ''
              }`}
              onClick={() => setplayercount(2)}
            >
              2-player
            </button>
          </div>
          <button
            className="frontbutton"
            onClick={() =>
              setGame({
                type: 'CHANGE_STATUS',
                payload: GameStatus.FRONTPAGE_NEW,
              })
            }
          >
            New Game
          </button>
          <button
            className="frontbutton"
            onClick={() =>
              setGame({
                type: 'CHANGE_STATUS',
                payload: GameStatus.FRONTPAGE_FIND,
              })
            }
          >
            Join Game
          </button>
          {errormsg ? <div>{errormsg}</div> : ''}
        </div>
      </div>
    );
  }

  return <div>Oh dear</div>;
}
