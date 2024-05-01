import React, {
  ReactNode,
  createContext,
  useContext,
  useReducer,
  useState,
} from 'react';
import gameReducer, { GameReducerAction } from '../Websocket/gameReducer';
import Game from '../Classes/game';
import SocketSender from '../Websocket/socketSender';

type gameDataContext = {
  game: Game;
  setGame: React.Dispatch<GameReducerAction>;
  mysocket: SocketSender;
  setMysocket: React.Dispatch<React.SetStateAction<SocketSender>>;
};

const GameContext = createContext<gameDataContext | null>(null);

export function GameContextProvider({ children }: { children: ReactNode }) {
  const [gameFromReducer, setGameFromReduxer] = useReducer(
    gameReducer,
    new Game()
  );
  const [mysocket, setMysocket] = useState<SocketSender>(
    new SocketSender(setGameFromReduxer)
  );
  const context: gameDataContext = {
    game: gameFromReducer,
    setGame: setGameFromReduxer,
    mysocket: mysocket,
    setMysocket: setMysocket,
  };
  return (
    <GameContext.Provider value={context}>{children}</GameContext.Provider>
  );
}

export function useGameContext() {
  const gameContextTemp = useContext(GameContext);
  //Will never be null, required by Typescript
  if (gameContextTemp === null) {
    throw new Error('GameContext is null!!!!!');
  }
  return gameContextTemp;
}
