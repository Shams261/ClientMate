import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Bootstrap CSS - must be imported before custom styles
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

// Custom styles (will override Bootstrap where needed)
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
