import './App.css';
import { useEffect } from 'react';
import FrontPage from './Pages/frontpage';
// import Codenames from './codeNames';
import _ from 'lodash';
import { GameStatus } from './Classes/game';

import CodeNames from './Pages/codenames';
import { useGameContext } from './Contexts/gameProvider';

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
      if (gameId === args.gameId) {
        //stored data matches URL, navigate to primary url
        window.location.href = '/';
      } else if (userId !== null && gameId !== null) {
        //used stored data to start new game
        mysocket.rejoinGame(userId, gameId);
      } else if (gameId !== null) {
        //used stored data to find game
        mysocket.findGame(gameId);
      } else if (args.gameId !== '') {
        //move URL argument to stored data, navigate to primary url
        localStorage.setItem('codenamesGameId', args.gameId);
        window.location.href = '/';
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
      </div>
    </div>
  );
}

export default App;
