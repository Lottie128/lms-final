import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

console.log('App starting...');

try {
  const root = document.getElementById('root');
  if (!root) {
    throw new Error('Root element not found');
  }
  
  console.log('Root element found, rendering app...');
  
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  console.log('App rendered successfully');
} catch (error) {
  console.error('Failed to start app:', error);
  document.body.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; font-family: system-ui;">
      <div style="max-width: 500px; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h1 style="color: #dc2626; margin-bottom: 16px;">Failed to Load Application</h1>
        <p style="color: #374151; margin-bottom: 16px;">${error instanceof Error ? error.message : 'Unknown error'}</p>
        <button onclick="location.reload()" style="background: #4f46e5; color: white; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer;">Reload</button>
      </div>
    </div>
  `;
}
