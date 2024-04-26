import Clue from '../Classes/clue';

export type JoinGameData = {
  gameId: string;
  playerCount: number;
  userId: number;
  role: number;
  words: string[];
  codex: {};
  firstTurn: string;
};
export type UpdateGameData = {
  nicknames: string[];
  resetGameSurvey: boolean[];
  clues: Clue[];
  turn: number;
  win: string;
  revealed: string[];
};
export type FindGameData = {
  gameId: string;
  playerCount: number;
  nicknames: string[];
};
export type ResetGameData = {
  words: string[];
  firstTurn: string;
  codex: {};
};
export type LeaveGameData = {
  userId: number;
};

export type AllMessageTypes =
  | JoinGameData
  | UpdateGameData
  | FindGameData
  | ResetGameData
  | LeaveGameData;
