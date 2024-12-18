import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import AuthProvider from '@context/Authentication';
import ToastProvider from '@context/Toasts';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <ToastProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ToastProvider>
  </React.StrictMode>
);