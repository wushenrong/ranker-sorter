import { Form } from 'react-router'

export function meta() {
  return [
    { title: 'Ranker Sorter' },
    { name: 'description', content: 'Welcome to React Router!' },
  ]
}

export default function Creator() {
  return (
    <Form
      action="/ranker"
      encType="multipart/form-data"
      method="post"
      replace={true}
      className="ranker-creation-form"
    >
      <fieldset>
        <legend>Load a custom ranker</legend>
        <label>
          Create custom ranker from JSON file:{' '}
          <input name="custom-ranker" type="file" accept="application/json" />
        </label>
      </fieldset>
      <button type="submit">Create Ranker</button>
    </Form>
  )
}
