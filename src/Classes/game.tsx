import {
  JoinGameData,
  UpdateGameData,
  FindGameData,
  ResetGameData,
} from '../Websocket/messageTypes';
import Clue from './clue';

export enum GameStatus {
  'FRONTPAGE_NEW',
  'FRONTPAGE_SELECT',
  'CODENAMES',
}

export default class Game {
  gameStatus: GameStatus = GameStatus.FRONTPAGE_NEW;
  errorMessage = '';
  //Data received in first message
  joinData = false;
  gameId: string = '';
  playerCount: number = 0;
  userId: number = 0;
  role: number = -1;
  words: string[] = [];
  firstTurn: string = '';
  codex: {} = {};
  //Data received by subsequent messages
  updateData = false;
  nicknames: string[] = [];
  resetGameSurvey: boolean[] = [];
  clues: Clue[] = [];
  turn: number = -1;
  win: string = '';
  revealed: string[] = [];

  joinGame = (data: JoinGameData) => {
    this.gameId = data.gameId;
    this.playerCount = data.playerCount;
    this.userId = data.userId;
    this.role = data.role;
    this.words = data.words;
    this.firstTurn = data.firstTurn;
    this.codex = data.codex;
    this.joinData = true;
    this.updateGameStatus();
  };
  updateGame = (data: UpdateGameData) => {
    this.nicknames = data.nicknames;
    this.resetGameSurvey = data.resetGameSurvey;
    this.clues = data.clues;
    this.turn = data.turn;
    this.win = data.win;
    this.revealed = data.revealed;
    this.updateData = true;
    this.updateGameStatus();
  };
  findGame = (data: FindGameData) => {
    this.gameId = data.gameId;
    this.playerCount = data.playerCount;
    this.nicknames = data.nicknames;
    this.gameStatus = GameStatus.FRONTPAGE_SELECT;
  };
  resetGame = (data: ResetGameData) => {
    this.words = data.words;
    this.firstTurn = data.firstTurn;
    this.codex = data.codex;
  };

  updateGameStatus = () => {
    if (this.joinData && this.updateData) {
      this.gameStatus = GameStatus.CODENAMES;
    }
  };
  setErrorMessage = (s: string) => {
    this.errorMessage = s;
  };
}
