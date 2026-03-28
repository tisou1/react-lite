import { ClickToComponent } from 'click-to-react-component'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './app/App'
import './index.css'

const root = ReactDOM.createRoot(document.querySelector('#root')!)

root.render(
  <React.StrictMode>
    <Router>
      <App />
      <ClickToComponent />
    </Router>
  </React.StrictMode>,
)
