import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom'

function ErrorBoundary() {
  const error = useRouteError()

  console.error(error)

  if (isRouteErrorResponse(error) && error.status == 404) {
    return (
      <p>
        {`${error.status}: ${error.statusText}`}
        <br />
        <Link to="/">
          This route does not exist, let&apos;s go back to the beginning and
          try again.
        </Link>
      </p>
    )
  }

  if (error instanceof Error) {
    return (
      <p>
        {error.message}
        <br />
        Please do not refresh the browser as the ranker does not store any
        information on your computer, and please complete the ranker in one run.
        <br />
        Do not forget to save your results after you are done.
        <br />
        <Link to="/">Go back main page</Link>
      </p>
    )
  }

  return (
    <p>
      Error: How did you get here! It&apos;s either something you have done or
      the developer is a moron for not considering an edge case.
      <br />
      <Link to="/">Go back main page</Link>
    </p>
  )
}

export default ErrorBoundary
