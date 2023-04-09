/*! SPDX-FileCopyrightText: 2023 Samuel Wu
 *
 * SPDX-License-Identifier: MIT
 */

import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'

import './index.css'

ReactDOM.createRoot(document.querySelector('main') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
