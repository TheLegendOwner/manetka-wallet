import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

// Hide loading screen and show app
const hideLoadingScreen = () => {
  const loadingScreen = document.getElementById('loading-screen');
  const rootElement = document.getElementById('root');
  
  if (loadingScreen && rootElement) {
    loadingScreen.classList.add('fade-out');
    rootElement.classList.add('loaded');
    
    setTimeout(() => {
      loadingScreen.remove();
    }, 500);
  }
};

// Create React root and render app
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  // Hide loading screen after a short delay
  setTimeout(hideLoadingScreen, 1000);
} else {
  console.error('Root element not found');
  
  // Show error message
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    loadingScreen.innerHTML = `
      <div class="loading-logo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="m15 9-6 6"/>
          <path d="m9 9 6 6"/>
        </svg>
      </div>
      <div class="loading-text">Loading Failed</div>
      <div class="loading-subtitle">Root element not found</div>
    `;
  }
}