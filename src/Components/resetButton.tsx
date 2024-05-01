import { useGameContext } from '../Contexts/gameProvider';

export function resetGameButton(inline: boolean = false) {
  const { game, mysocket } = useGameContext();
  const inlineButton = inline ? 'resetgamebutton-inline' : '';

  if (game.resetGameSurvey[game.role]) {
    return <div>Awaiting reset confirmation</div>;
  }

  if (game.resetGameSurvey.includes(true)) {
    const resetMsg =
      game.win !== ''
        ? 'Rematch?'
        : 'Someone has requested a reset. Do you wish to reset as well?';

    return (
      <div>
        <div>{resetMsg}</div>
        <div className="resetresponses">
          <div
            className={`resetgamebutton ${inlineButton}`}
            onClick={() => mysocket.resetConfirm(true)}
          >
            Reset!
          </div>
          {game.win === '' ? (
            <div
              className={`resetgamebutton ${inlineButton}`}
              onClick={() => mysocket.resetConfirm(false)}
            >
              Keep playing
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    );
  }
  const resetButtonText = game.win === '' ? 'Reset Game' : 'Another game?';
  return (
    <div className="resetresponses">
      <div
        className={`resetgamebutton ${inlineButton}`}
        onClick={() => mysocket.resetGame()}
      >
        {resetButtonText}
      </div>
    </div>
  );
}
