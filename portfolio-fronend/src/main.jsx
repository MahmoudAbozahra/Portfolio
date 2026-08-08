import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './App.css'  // تغيير من styles.css إلى App.css

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)