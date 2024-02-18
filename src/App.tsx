import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { createRankerAction, getResultsAction } from './app/actions'
import ErrorBoundary from './routes/ErrorBoundary'
import Index from './routes/Index'
import Ranker from './routes/Ranker'
import Results from './routes/Results'
import './styles/App.css'

const router = createBrowserRouter(
  [
    {
      action: createRankerAction,
      element: <Index />,
      errorElement: <ErrorBoundary />,
      path: '/',
    },
    {
      element: <Ranker />,
      errorElement: <ErrorBoundary />,
      path: '/ranker',
    },
    {
      action: getResultsAction,
      element: <Results />,
      errorElement: <ErrorBoundary />,
      path: '/results',
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  },
)

function App() {
  return (
    <main>
      <RouterProvider router={router} />
    </main>
  )
}

export default App
