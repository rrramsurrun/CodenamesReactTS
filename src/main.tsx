import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { GameContextProvider } from './contextProvider.tsx';

const params = new URLSearchParams(window.location.search);
const gameId = params.get('gameId') || '';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GameContextProvider>
      <App gameId={gameId} />
    </GameContextProvider>
  </React.StrictMode>
);
