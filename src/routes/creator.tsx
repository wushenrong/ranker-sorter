/*
 * SPDX-FileCopyrightText: 2025 Samuel Wu
 *
 * SPDX-License-Identifier: MIT
 */

import { useState } from "react";
import { Form } from "react-router";

export function Creator() {
  const [isStarting, setIsStarting] = useState(false);

  return (
    <Form
      action="/ranker"
      className="ranker-creation"
      encType="multipart/form-data"
      method="POST"
      onSubmit={() => setIsStarting(true)}
      replace={true}
    >
      <fieldset>
        <legend>Load a custom ranker</legend>
        <label>
          Create custom ranker from JSON file:{" "}
          <input accept="application/json" name="custom-ranker" type="file" />
        </label>
      </fieldset>
      <button disabled={isStarting} type="submit">
        {isStarting ? "Creating ranker..." : "Create Ranker"}
      </button>
    </Form>
  );
}
