import { useState, useEffect } from 'react';
import { IconCopy } from '@tabler/icons-react';
import { useGameContext } from '../Contexts/gameProvider';
import { playersBox } from '../Components/playerCards';
import { wordCard } from '../Components/wordCard';
import { cluesHistory } from '../Components/clueHistoryBox';
import { resetGameButton } from '../Components/resetButton';
import { codexClueBox } from '../Components/codexGuide2Player';
import { clueBox } from '../Components/clueBox';

export default function CodeNames() {
  const { game, mysocket } = useGameContext();
  const [clipboardNote, setclipboardNote] = useState(false);
  const [narrowScreen, setnarrowScreen] = useState(false);

  //adjust for a narrow screen
  useEffect(() => {
    const mediaWatcher = window.matchMedia('(max-width: 700px)');
    setnarrowScreen(mediaWatcher.matches);
    function updateNarrowScreen(e: MediaQueryListEvent) {
      setnarrowScreen(e.matches);
    }
    mediaWatcher.addEventListener('change', updateNarrowScreen);
    return () => {
      mediaWatcher.removeEventListener('change', updateNarrowScreen);
    };
  }, []);

  //Copy join URL to clipboard confirmation hides after 3s
  useEffect(() => {
    if (clipboardNote) {
      setTimeout(() => {
        setclipboardNote(false);
      }, 3000);
    }
  }, [clipboardNote]);

  const clipboardFunction = () => {
    const URL = import.meta.env.PROD
      ? 'https://ramsurrun-portfolio.com/codenames/?gameId='
      : 'http://localhost:5173/codenames/?gameId=';
    navigator.clipboard.writeText(`${URL}${game.gameId}`);
    setclipboardNote(true);
  };

  function copyURLToClipboard() {
    return (
      <div className="clipboardnotice">
        <IconCopy className="shareButton" onClick={() => clipboardFunction()} />
        <span>
          {clipboardNote ? 'Linked copied to clipboard' : 'Share Link'}
        </span>
      </div>
    );
  }

  function centralBoard() {
    return (
      <div className="cards">
        {[0, 1, 2, 3, 4].map((e) => (
          <div key={`wordrow ${e}`} className="wordsrow">
            {[...Array(5).keys()].map((ee) =>
              wordCard(game, mysocket, (e + 1) * 5 - (5 + -ee))
            )}
          </div>
        ))}
        {clueBox()}
        {game.playerCount === 2 ? codexClueBox() : ''}
        {cluesHistory()}
      </div>
    );
  }

  if (narrowScreen) {
    return (
      <div>
        <div className="headerbox">
          {copyURLToClipboard()}
          {resetGameButton()}
        </div>
        <div className="gamescreen">
          <div className="players-box">
            {game.playerCount === 4 ? playersBox('red') : playersBox('left')}
            {game.playerCount === 4 ? playersBox('blue') : playersBox('right')}
          </div>
          {centralBoard()}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="headerbox">{copyURLToClipboard()}</div>
      <div className="gamescreen">
        <div className="players-box">
          {game.playerCount === 4 ? playersBox('red') : playersBox('left')}
          {game.role < 2 ? resetGameButton() : null}
        </div>
        {centralBoard()}
        {
          <div className="players-box">
            {game.playerCount === 4 ? playersBox('blue') : playersBox('right')}
            {game.role >= 2 ? resetGameButton() : null}
          </div>
        }
      </div>
    </div>
  );
}
