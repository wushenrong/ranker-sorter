/*
 * SPDX-FileCopyrightText: 2025 Samuel Wu
 *
 * SPDX-License-Identifier: MIT
 */

import { Form, useNavigation } from "react-router";

export function RankerCreator() {
  const navigation = useNavigation();
  const isStarting = Boolean(navigation.location);

  return (
    <Form
      action="/ranking"
      className="ranker-creation"
      encType="multipart/form-data"
      method="POST"
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
