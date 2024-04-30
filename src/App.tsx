import './App.css';

import { useEffect } from 'react';
import SocketSender from './Websocket/socketSender';
import { RemoveSocketListeners } from './Websocket/socketListener';
import FrontPage from './Pages/frontpage';
// import Codenames from './codeNames';
import _ from 'lodash';
import { GameStatus } from './Classes/game';

import CodeNames from './Pages/codenames';
import { useGameContext } from './contextProvider';
const socketUrl = import.meta.env.PROD
  ? 'wss://ramsurrun-portfolio.com/codenames'
  : 'wss://localhost:8001/codenames';

function App(args: { gameId: string }) {
  const { game, mysocket } = useGameContext();
  // const [game, setGame] = useReducer(gameReducer, new Game());
  // const [mysocket, setMysocket] = useState<SocketSender | undefined>(undefined);

  useEffect(() => {
    //Runs on first render and when socket is reopened
    //If socket is open and game is null, check for stored game data or URL data
    if (game.gameStatus === GameStatus.FRONTPAGE_START) {
      //check local storage
      const userId = localStorage.getItem('codenamesUserId');
      const gameId = localStorage.getItem('codenamesGameId');
      if (userId !== null && gameId !== null) {
        console.log('Rejoining game');
        mysocket.rejoinGame(userId, gameId);
      }
      //check URL parameters
      else if (args.gameId !== '') {
        mysocket.findGame(args.gameId);
      }
    }
  }, [args]);

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
