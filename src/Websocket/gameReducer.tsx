import _ from 'lodash';
import Game, { GameStatus } from '../Classes/game';
import {
  JoinGameData,
  UpdateGameData,
  FindGameData,
  ResetGameData,
  LeaveGameData,
} from './messageTypes';

type UpdateGameAction = {
  type: 'UPDATE_GAME';
  payload: UpdateGameData;
};

type JoinGameAction = {
  type: 'JOIN_GAME';
  payload: JoinGameData;
};

type FindGameAction = {
  type: 'FIND_GAME';
  payload: FindGameData;
};

type CancelJoinGameAction = {
  type: 'CANCELJOIN_GAME';
};

type ResetGameAction = {
  type: 'RESET_GAME';
  payload: ResetGameData;
};
type LeaveGameAction = {
  type: 'LEAVE_GAME';
  payload: LeaveGameData;
};
type ChangeStatusAction = {
  type: 'CHANGE_STATUS';
  payload: GameStatus;
};

export type GameReducerAction =
  | UpdateGameAction
  | JoinGameAction
  | FindGameAction
  | ResetGameAction
  | LeaveGameAction
  | CancelJoinGameAction
  | ChangeStatusAction;

export default function gameReducer(
  state: Game,
  action: GameReducerAction
): Game {
  if (action.type == 'UPDATE_GAME') {
    state.updateGame(action.payload);
    return _.cloneDeep(state);
  }
  if (action.type == 'JOIN_GAME') {
    const payload = action.payload;
    localStorage.setItem('codenamesUserId', String(payload.userId));
    localStorage.setItem('codenamesGameId', payload.gameId);
    state.joinGame(payload);
    return _.cloneDeep(state);
  }
  if (action.type == 'FIND_GAME') {
    state.findGame(action.payload);
    return _.cloneDeep(state);
  }
  if (action.type == 'RESET_GAME') {
    state.resetGame(action.payload);
    return _.cloneDeep(state);
  }
  if (action.type == 'LEAVE_GAME') {
    if (action.payload.userId === state.userId) {
      localStorage.removeItem('codenamesUserId');
      localStorage.removeItem('codenamesGameId');
      window.location.href = '/codenames/codenames.html';
      return new Game();
    }
    state.setErrorMessage(
      'Could not leave game. Please try refreshing the page'
    );
    return state;
  }
  if (action.type === 'CANCELJOIN_GAME') {
    //Cancel an attempted game join
    return new Game();
  }
  if (action.type === 'CHANGE_STATUS') {
    //Toggle front page between 'Create' and 'Find' game
    state.gameStatus = action.payload;
    return _.cloneDeep(state);
  }
  return state;
}
