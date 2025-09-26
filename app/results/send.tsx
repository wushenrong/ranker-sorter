/*
 * SPDX-FileCopyrightText: 2025 Samuel Wu
 *
 * SPDX-License-Identifier: MIT
 */

import { useState } from "react";
import * as zod from "zod/mini";

import type { RankerResult as SaveResultsProps } from "~/schemas";

export const endpointResponse = zod.union([
  zod.object({
    result: zod.literal("success"),
  }),
  zod.object({
    error: zod.string(),
    result: zod.literal("error"),
  }),
]);

type SendState = "unsent" | "sending" | "error" | "sent";

export function SendResults(results: SaveResultsProps) {
  const [sendState, setSendState] = useState<SendState>("unsent");

  const sendResults = async () => {
    if (sendState === "sent" || sendState === "sending") {
      return;
    }

    setSendState("sending");

    const response = await fetch(import.meta.env.DATABASE_ENDPOINT, {
      body: JSON.stringify(results),
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      method: "POST",
      redirect: "follow",
    });

    if (!response.ok) {
      setSendState("error");
      return;
    }

    const result = endpointResponse.safeParse(await response.json());

    if (!result.success || result.data.result === "error") {
      setSendState("error");
      return;
    }

    setSendState("sent");
  };

  return (
    <button
      disabled={sendState === "sent" || sendState === "sending"}
      onClick={sendResults}
      type="button"
    >
      {sendState === "sent"
        ? "Results Sent"
        : sendState === "error"
          ? "Error sending results. Click to try again."
          : sendState === "sending"
            ? "Sending Results"
            : "Send Results"}
    </button>
  );
}
