import './App.css';
import React, { useContext } from 'react';
import { useEffect, useState, useReducer } from 'react';
import SocketSender from './Websocket/socketSender';
import {
  AddSocketListeners,
  RemoveSocketListeners,
} from './Websocket/socketListener';
import FrontPage from './Pages/frontpage';
// import Codenames from './codeNames';
import _ from 'lodash';
import Game, { GameStatus } from './Classes/game';
import gameReducer from './Websocket/gameReducer';
import CodeNames from './Pages/codenames';
import { useGameContext } from './contextProvider';
const socketUrl = import.meta.env.PROD
  ? 'wss://ramsurrun-portfolio.com/codenames'
  : 'wss://localhost:8001/codenames';

function App(args: { gameId: string }) {
  const [foundgame, setfoundgame] = useState(null);
  const [errormsg, seterrormsg] = useState('');
  const [gamestatus, setGamestatus] = useState('frontpage');
  const { game, setGame, mysocket, setMysocket } = useGameContext();
  // const [game, setGame] = useReducer(gameReducer, new Game());
  // const [mysocket, setMysocket] = useState<SocketSender | undefined>(undefined);

  useEffect(() => {
    //Runs on first render and when socket is reopened
    //If socket is open and game is null, check for stored game data or URL data
    if (
      mysocket !== undefined &&
      game.gameStatus === GameStatus.FRONTPAGE_START
    ) {
      //check local storage
      const userId = localStorage.getItem('codenamesUserId');
      const gameId = localStorage.getItem('codenamesGameId');
      if (userId !== null && gameId !== null) {
        console.log('Rejoining game');
        mysocket.rejoinGame(userId, gameId);
        return;
      }
      //check URL parameters
      if (args.gameId !== '') {
        mysocket.findGame(args.gameId);
      }
    }
  }, [mysocket, mysocket?.readyState, args]);

  useEffect(() => {
    if (mysocket != null) {
      AddSocketListeners(mysocket, setGame, setMysocket);
    } else {
      setTimeout(function () {
        const newSocket = new SocketSender(socketUrl);
        setMysocket(newSocket);
      }, 1000);
    }

    return () => {
      if (mysocket != null) {
        RemoveSocketListeners(mysocket);
        mysocket.close();
      }
    };
  }, [mysocket]);
  return (
    <div>
      <div className="App">
        <header className="App-header"></header>
        {mysocket === undefined ? (
          <div>Connecting.....</div>
        ) : (
          <div className="App-body">
            {game.gameStatus === GameStatus.CODENAMES ? (
              <CodeNames />
            ) : (
              <FrontPage />
            )}
          </div>
        )}
        <button
          className="frontbutton"
          onClick={() =>
            console.log(
              `${localStorage.getItem('codenamesUserId')} and 
                ${localStorage.getItem('codenamesGameId')}`
            )
          }
        >
          Check local storage
        </button>
        <button className="frontbutton" onClick={() => console.log(game)}>
          Check game
        </button>
        <button
          className="frontbutton"
          onClick={() => console.log(mysocket?.userId)}
        >
          Check stackuserId
        </button>
      </div>
    </div>
  );
}

export default App;
