import { useGameContext } from '../contextProvider';

export function resetGameButton() {
  const { game, mysocket } = useGameContext();
  if (game.resetGameSurvey[game.role]) {
    return <div>Awaiting other players' confirmation</div>;
  }

  if (game.resetGameSurvey.includes(true)) {
    const resetMsg =
      game.win !== null
        ? 'Rematch?'
        : 'Someone has requested a reset. Do you wish to reset as well?';

    return (
      <div>
        <div>{resetMsg}</div>
        <div className="resetresponses">
          <div
            className="resetgamebutton"
            onClick={() => mysocket?.resetConfirm(true)}
          >
            Reset!
          </div>
          <div
            className="resetgamebutton"
            onClick={() => mysocket?.resetConfirm(false)}
          >
            Keep playing
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="resetresponses">
      <div className="resetgamebutton" onClick={() => mysocket?.resetGame()}>
        {game.win !== null ? 'Another Game' : 'Reset Game'}
      </div>
    </div>
  );
}
