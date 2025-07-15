import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import SpotifyEnhanced from './SpotifyEnhanced.jsx'

console.log('🚀 LOADING SPOTIFY ENHANCED - PREMIUM EXPERIENCE');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SpotifyEnhanced />
  </StrictMode>,
)
