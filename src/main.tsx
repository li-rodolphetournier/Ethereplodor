import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { inputManager } from './engine/input/InputManager';

// Initialiser l'InputManager dès le démarrage de l'application
inputManager.init();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

