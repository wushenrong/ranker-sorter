/*
 * SPDX-FileCopyrightText: 2025 Samuel Wu
 *
 * SPDX-License-Identifier: MIT
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'

import { rankerAction, resultsAction } from './app/actions'
import Creator from './routes/creator'
import Ranker from './routes/ranker'
import Results from './routes/results'

import './index.css'

import { ErrorBoundary } from './routes/errorboundary'

const router = createBrowserRouter(
  [
    {
      Component: Creator,
      errorElement: <ErrorBoundary />,
      index: true,
    },
    {
      action: rankerAction,
      Component: Ranker,
      path: '/ranker',
    },
    {
      action: resultsAction,
      Component: Results,
      path: '/results',
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  },
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
