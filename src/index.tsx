// src/index.tsx
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from 'styled-components';
import { 
  lightTheme, 
  GlobalStyles,
  MeetingProvider
} from 'amazon-chime-sdk-component-library-react';
import MeetingForm from './components/MeetingForm';
import Meeting from './components/Meeting';

const App: React.FC = () => {
  const [isMeetingJoined, setIsMeetingJoined] = useState(false);

  return (
    <ThemeProvider theme={lightTheme}>
      <GlobalStyles />
      <MeetingProvider>
        {isMeetingJoined ? (
          <Meeting />
        ) : (
          <MeetingForm onJoined={() => setIsMeetingJoined(true)} />
        )}
      </MeetingProvider>
    </ThemeProvider>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
