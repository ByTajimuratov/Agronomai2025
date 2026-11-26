import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
//import './index.css'; 

// 1. Providerlarni import qilamiz
import { GlobalProvider } from './store/GlobalStore';
import { PremiumProvider } from './contexts/PremiumContext'; // Yo'lni tekshiring
import { ToastContainer } from './components/shared/ToastContainer'; // Yo'lni tekshiring

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    {/* 2. Providerlar tartibi juda muhim: Global eng tepada turishi kerak */}
    <GlobalProvider>
      <PremiumProvider>
        <App />
        {/* ToastContainer har doim Providerlar ichida bo'lishi shart */}
        <ToastContainer />
      </PremiumProvider>
    </GlobalProvider>
  </React.StrictMode>
);