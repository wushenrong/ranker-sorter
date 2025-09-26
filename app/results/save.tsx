/*
 * SPDX-FileCopyrightText: 2025 Samuel Wu
 *
 * SPDX-License-Identifier: MIT
 */

import type { RankerResult as SaveResultsProps } from "~/schemas";

export function SaveResults(results: SaveResultsProps) {
  const saveResults = () => {
    const data = JSON.stringify(results);
    const blob = new Blob([data], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = href;
    a.download = "ranker-results.json";

    document.body.appendChild(a);

    a.click();
    a.remove();

    URL.revokeObjectURL(href);
  };

  return (
    <button onClick={saveResults} type="button">
      Save Results
    </button>
  );
}
