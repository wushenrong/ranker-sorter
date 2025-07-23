/*
 * SPDX-FileCopyrightText: 2025 Samuel Wu
 *
 * SPDX-License-Identifier: MIT
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./app";
import "./index.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error(
    'Not able to get HTML element with id="root", did you forget to add it?',
  );
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
