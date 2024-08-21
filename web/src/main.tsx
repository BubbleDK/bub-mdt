import { MantineProvider } from '@mantine/core';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { isEnvBrowser } from './utils/misc';
import { HashRouter } from 'react-router-dom';
import './index.css'

if (isEnvBrowser()) {
  const root = document.getElementById('root')

  // https://i.imgur.com/iPTAdYV.png - Night time img
  root!.style.backgroundSize = 'cover'
  root!.style.backgroundRepeat = 'no-repeat'
  root!.style.backgroundPosition = 'center'
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider theme={{colorScheme: 'dark', fontFamily: 'Nunito, sans-serif'}}>
      <HashRouter>
        <App/>
      </HashRouter>
    </MantineProvider>
  </React.StrictMode>,
)
