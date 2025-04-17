import { Form } from 'react-router'

export default function Creator() {
  return (
    <Form
      action="/ranker"
      className="ranker-creation"
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
