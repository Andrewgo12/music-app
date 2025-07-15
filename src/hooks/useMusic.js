import { useContext } from 'react';
import { MusicContext } from '../context/MusicContext';

// Custom Hook
export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
}
