import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { ClickToComponent } from 'click-to-react-component'
import { BrowserRouter as Router, useRoutes } from 'react-router-dom'
import routes from '~react-pages'
import './index.css'
import 'uno.css'


const root = ReactDOM.createRoot(document.querySelector('#root')!)

const App = () => {
  return (
    <Suspense>
      {useRoutes(routes)}
    </Suspense>
  )
}

root.render(
  <React.StrictMode>
    <Router>
      <App />
      <ClickToComponent />
    </Router>
  </React.StrictMode>
)