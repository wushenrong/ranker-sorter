import { Form } from 'react-router'

export function meta() {
  return [
    { title: 'Ranker Sorter' },
    { content: 'Welcome to React Router!', name: 'description' },
  ]
}

export default function Creator() {
  return (
    <Form
      action="/ranker"
      className="ranker-creation-form"
      encType="multipart/form-data"
      method="post"
      replace={true}
    >
      <fieldset>
        <legend>Load a custom ranker</legend>
        <label>
          Create custom ranker from JSON file:{' '}
          <input accept="application/json" name="custom-ranker" type="file" />
        </label>
      </fieldset>
      <button type="submit">Create Ranker</button>
    </Form>
  )
}
