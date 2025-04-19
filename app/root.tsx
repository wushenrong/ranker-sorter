/*
 * SPDX-FileCopyrightText: 2025 Samuel Wu
 *
 * SPDX-License-Identifier: MIT
 */

import {
  isRouteErrorResponse,
  Links,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router'

import type { Route } from './+types/root'

import './app.css'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <title>Ranker Sorter</title>
        <meta
          content="If you can rank chess players by using Elo, then why not for everything else."
          name="description"
        />
        <Links />
      </head>
      <body>
        <h1>Ranker Sorter</h1>
        <p>
          A yet another ranker that uses the Elo Rating System, famous in the
          world of chess to rate the skills of players in a zero-sum game.
        </p>
        <section>
          <h2>Why rank things using Elo?</h2>
          <p>
            Well popularity and favorites is like a zero-sum game as something
            or someone is competing how much time you will give focus to them as
            time is a limited resource. So why not try to quantify that as a
            ranking.
          </p>
        </section>
        <main>{children}</main>
        <footer>
          <p>
            Made with open source projects. Source code hosted on{' '}
            <a href="https://github.com/wushenrong/ranker-sorter">GitHub</a>.
            Hosted on <a href="https://pages.github.com">GitHub Pages</a>.
          </p>
          <p>
            Some code in this project is AI generated and they are licensed
            under the{' '}
            <a href="https://spdx.org/licenses/MIT-0.html">MIT-0 License</a>.
            The rest of the project is licensed under the{' '}
            <a href="https://spdx.org/licenses/MIT.html">MIT License</a>.
          </p>
        </footer>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}

export function HydrateFallback() {
  return <p>Loading, please wait...</p>
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!'
  let details = 'An unexpected error occurred.'
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error'
    details =
      error.status === 404
        ? 'The requested content could not be found.'
        : error.statusText || details
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message
    stack = error.stack
  }

  return (
    <>
      <h2>{message}</h2>
      <p>{details}</p>
      {stack && (
        <pre>
          <code>{stack}</code>
        </pre>
      )}
    </>
  )
}
