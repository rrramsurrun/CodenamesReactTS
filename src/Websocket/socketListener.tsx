import SocketSender from './socketSender';
import { GameReducerAction } from './gameReducer';
import {
  FindGameData,
  JoinGameData,
  LeaveGameData,
  ResetGameData,
  UpdateGameData,
} from './messageTypes';

export function AddSocketListeners(
  socket: SocketSender,
  setGame: React.Dispatch<GameReducerAction>,
  setMysocket: (s: SocketSender | undefined) => void
) {
  socket.onclose = function () {
    setMysocket(undefined);
  };

  socket.onmessage = (event) => {
    const response = JSON.parse(event.data);
    // console.log('Received');
    // console.log(response);
    if (
      !['responseType', 'body'].every((key) =>
        Object.keys(response).includes(key)
      )
    ) {
      console.log('Incoming websocket message was not in the correct format');
      return;
    }
    console.log(response);
    const responseBody = response.body;
    switch (response.responseType) {
      case 'updateGame':
        const dataUpdate = responseBody as UpdateGameData;
        setGame({ type: 'UPDATE_GAME', payload: dataUpdate });
        break;
      case 'joinGame':
        socket.userId = responseBody.userId;
        const dataJoin = responseBody as JoinGameData;
        setGame({ type: 'JOIN_GAME', payload: dataJoin });
        break;
      case 'findGame':
        const dataFind = responseBody as FindGameData;
        setGame({ type: 'FIND_GAME', payload: dataFind });
        break;
      case 'resetGame':
        const dataReset = responseBody as ResetGameData;
        setGame({ type: 'RESET_GAME', payload: dataReset });
        break;
      case 'leaveGame':
        const dataLeave = responseBody as LeaveGameData;
        setGame({ type: 'LEAVE_GAME', payload: dataLeave });
        //TODO A function to clear the url
        //window.location.href = '/';
        break;
      case 'FindGameError':
        localStorage.removeItem('codenamesUserId');
        localStorage.removeItem('codenamesGameId');
        console.log(responseBody);
        break;
      default:
        console.log('No methods available for this websocket message:');
        console.log(responseBody);
        break;
    }
  };
}

export function RemoveSocketListeners(socket: SocketSender) {
  socket.removeEventListener('message', () => {});
  socket.removeEventListener('close', () => {});
}
