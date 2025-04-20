/*
 * SPDX-FileCopyrightText: 2025 Samuel Wu
 *
 * SPDX-License-Identifier: MIT
 */

import { Form } from 'react-router'

export function Component() {
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
      <p>
        Once you create the ranker, you will have to finish the entire ranker to
        save your results. This site <strong>does not</strong> save any data on
        you computer. Do not reload the browser while completing the ranker.
      </p>
      <button type="submit">Create Ranker</button>
    </Form>
  )
}
