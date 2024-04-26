type newGameArgs = {
  role: string;
  nickname: string;
  playercount: number;
};
type findGameArgs = { gameId: string };
type joinGameArgs = { gameId: string; role: string; nickname: string };
type rejoinGameArgs = { userId: string; gameId: string };
type sendClueArgs = { clue: string; clueCount: number };
type clickWordArgs = { wordIndex: number };
type emptyArgs = {};
type decorativeEmitArgs =
  | newGameArgs
  | findGameArgs
  | joinGameArgs
  | rejoinGameArgs
  | sendClueArgs
  | clickWordArgs
  | emptyArgs;

export default class SocketSender extends WebSocket {
  userId: string;

  constructor(url: string) {
    super(url);
    this.userId = '';
  }

  decorativeEmit = (requestType: string, args: decorativeEmitArgs) => {
    //Convert any non-strings to strings
    Object.keys(args).forEach((key) => {
      // @ts-ignore
      if (typeof args[key] !== 'string') {
        // @ts-ignore
        args[key] = String(args[key]);
      }
    });
    console.log(`Sending message`);
    console.log(JSON.stringify({ RequestType: requestType, Body: args }));
    this.send(JSON.stringify({ RequestType: requestType, Body: args }));
  };

  newGame = (role: string, nickname: string, playercount: number) => {
    this.decorativeEmit('newGame', {
      role: role,
      nickname: nickname,
      playercount: playercount,
    });
  };

  findGame = (gameId: string) => {
    this.decorativeEmit('findGame', { gameId: gameId });
  };
  joinGame = (gameId: string, role: string, nickname: string) => {
    this.decorativeEmit('joinGame', {
      gameId: gameId,
      role: role,
      nickname: nickname,
    });
  };
  rejoinGame = (userId: string, gameId: string) => {
    this.decorativeEmit('rejoinGame', { userId: userId, gameId: gameId });
  };

  leaveGame = () => {
    this.decorativeEmit('leaveGame', { userId: this.userId });
  };

  resetGame = () => {
    this.decorativeEmit('resetGame', { userId: this.userId });
  };

  resetConfirm = (reset: boolean) => {
    if (reset) {
      this.decorativeEmit('resetGameConfirm', { userId: this.userId });
    } else {
      this.decorativeEmit('resetGameReject', { userId: this.userId });
    }
  };
  requestNewWords = () => {
    this.decorativeEmit('requestNewWords', { userId: this.userId });
  };

  sendClue = (clue: string, clueCount: number) => {
    this.decorativeEmit('sendClue', {
      userId: this.userId,
      clue: clue,
      clueCount: clueCount,
    });
  };
  clickWord = (wordIndex: number) => {
    this.decorativeEmit('clickWord', {
      userId: this.userId,
      wordIndex: wordIndex,
    });
  };
  endTurn = () => {
    this.decorativeEmit('endTurn', { userId: this.userId });
  };
}
