import { google } from "googleapis";
import { GSheetsAppendRowInput, InternalToolResponse } from "./types.js";

export const schema = {
  name: "gsheets_append_row",
  description: "Append a row of values to a Google Spreadsheet",
  inputSchema: {
    type: "object",
    properties: {
      fileId: {
        type: "string",
        description: "ID of the spreadsheet",
      },
      range: {
        type: "string",
        description: "A1 notation range to search for the table (e.g., 'Sheet1!A:A' or 'Sheet1!A1:Z1'). Values will be appended to the next row of the table.",
      },
      values: {
        type: "array",
        items: {
          type: "string",
        },
        description: "Array of values to append as a new row",
      },
      valueInputOption: {
        type: "string",
        enum: ["RAW", "USER_ENTERED", "INPUT_VALUE_OPTION_UNSPECIFIED"],
        description: "How input data should be interpreted (default: USER_ENTERED)",
        default: "USER_ENTERED",
      },
      insertDataOption: {
        type: "string",
        enum: ["OVERWRITE", "INSERT_ROWS"],
        description: "How data should be inserted (default: INSERT_ROWS)",
        default: "INSERT_ROWS",
      },
    },
    required: ["fileId", "range", "values"],
  },
} as const;

export async function appendRow(
  args: GSheetsAppendRowInput,
): Promise<InternalToolResponse> {
  const { 
    fileId, 
    range, 
    values, 
    valueInputOption = "USER_ENTERED",
    insertDataOption = "INSERT_ROWS" 
  } = args;
  
  const sheets = google.sheets({ version: "v4" });

  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: fileId,
      range: range,
      valueInputOption: valueInputOption,
      insertDataOption: insertDataOption,
      requestBody: {
        values: [values], // Wrap the values array in another array to represent a single row
      },
    });

    const updatedRange = response.data.updates?.updatedRange || "unknown range";
    const updatedRows = response.data.updates?.updatedRows || 0;
    const updatedCells = response.data.updates?.updatedCells || 0;

    return {
      content: [
        {
          type: "text",
          text: `Successfully appended row to ${updatedRange}. Updated ${updatedRows} row(s) and ${updatedCells} cell(s). Values: [${values.join(", ")}]`,
        },
      ],
      isError: false,
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error appending row to spreadsheet: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
}
