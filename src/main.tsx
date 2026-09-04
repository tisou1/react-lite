import { ClickToComponent } from 'click-to-react-component'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './app/App'
import './index.css'

// BASE_URL 在构建时由 `vite build --base=...` 决定（如 `/react-lite/`）。
// 传给 BrowserRouter 作为 basename，GitHub Pages 子路径部署时路由才能正确匹配。
const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

const root = ReactDOM.createRoot(document.querySelector('#root')!)

root.render(
  <React.StrictMode>
    <Router basename={basename}>
      <App />
      <ClickToComponent />
    </Router>
  </React.StrictMode>,
)
