/*
 * SPDX-FileCopyrightText: 2017 Jamie Wilson
 * SPDX-FileCopyrightText: 2018 Om Prakash Shanmugam
 * SPDX-FileCopyrightText: 2023 Noah
 * SPDX-FileCopyrightText: 2024 Levi Nunnink
 * SPDX-FileCopyrightText: 2025 Samuel Wu
 *
 * SPDX-License-Identifier: MIT OR Apache-2.0
 */

const scriptProp = PropertiesService.getScriptProperties();

function initialSetup() {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  scriptProp.setProperty("spreadsheetId", activeSpreadsheet.getId());
}

function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    lock.waitLock(10000);

    const data = JSON.parse(e.postData.contents);
    const spreadsheet = SpreadsheetApp.openById(
      scriptProp.getProperty("spreadsheetId"),
    );

    for (const [index, player] of data.players.entries()) {
      const sheet = spreadsheet.getSheetByName(player.name);
      const header = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues();
      const headings = header[0];
      const nextRow = sheet.getLastRow() + 1;

      const newRow = headings.map((heading) =>
        heading === "rank" ? index + 1 : player[heading],
      );

      sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);
    }

    return ContentService.createTextOutput(
      JSON.stringify({ result: "success" }),
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ error, result: "error" }),
    ).setMimeType(ContentService.MimeType.JSON);
  } finally {
    SpreadsheetApp.flush();
    lock.releaseLock();
  }
}
