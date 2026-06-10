import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import SmartCartApp from './SmartCartMVP.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SmartCartApp />
  </StrictMode>,
)
