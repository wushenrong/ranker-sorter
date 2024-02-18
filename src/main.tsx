import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'
import './styles/index.css'

const rootContainerElement = document.querySelector('#root')

if (!rootContainerElement) {
  throw new Error(
    'No root container element found, please add one with id="root".',
  )
}

const root = ReactDOM.createRoot(rootContainerElement)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
