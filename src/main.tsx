import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AppStateProvider } from './contexts/AppStateContext'
import { GlobalStateProvider } from './contexts/GlobalStateContext'

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GlobalStateProvider>
      <AppStateProvider>
        <App />
      </AppStateProvider>
    </GlobalStateProvider>
  </React.StrictMode>
);
