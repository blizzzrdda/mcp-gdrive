import { google } from "googleapis";
import { GSheetsBatchUpdateInput, InternalToolResponse } from "./types.js";

export const schema = {
  name: "gsheets_batch_update",
  description: "Update multiple cell ranges in a Google Spreadsheet in a single batch operation",
  inputSchema: {
    type: "object",
    properties: {
      fileId: {
        type: "string",
        description: "ID of the spreadsheet",
      },
      updates: {
        type: "array",
        items: {
          type: "object",
          properties: {
            range: {
              type: "string",
              description: "A1 notation range (e.g., 'Sheet1!A1:B2')",
            },
            values: {
              type: "array",
              items: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              description: "2D array of values to update. Each inner array represents a row.",
            },
          },
          required: ["range", "values"],
        },
        description: "Array of range updates to perform",
      },
      valueInputOption: {
        type: "string",
        enum: ["RAW", "USER_ENTERED", "INPUT_VALUE_OPTION_UNSPECIFIED"],
        description: "How input data should be interpreted (default: USER_ENTERED)",
        default: "USER_ENTERED",
      },
      includeValuesInResponse: {
        type: "boolean",
        description: "Whether to include updated values in response (default: false)",
        default: false,
      },
    },
    required: ["fileId", "updates"],
  },
} as const;

export async function batchUpdate(
  args: GSheetsBatchUpdateInput,
): Promise<InternalToolResponse> {
  const { 
    fileId, 
    updates, 
    valueInputOption = "USER_ENTERED",
    includeValuesInResponse = false 
  } = args;
  
  const sheets = google.sheets({ version: "v4" });

  try {
    // Transform our updates into the format expected by the Google Sheets API
    const data = updates.map(update => ({
      range: update.range,
      values: update.values,
    }));

    const response = await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: fileId,
      requestBody: {
        valueInputOption: valueInputOption,
        data: data,
        includeValuesInResponse: includeValuesInResponse,
      },
    });

    const totalUpdatedCells = response.data.totalUpdatedCells || 0;
    const totalUpdatedRows = response.data.totalUpdatedRows || 0;
    const totalUpdatedColumns = response.data.totalUpdatedColumns || 0;
    const totalUpdatedSheets = response.data.totalUpdatedSheets || 0;
    const updatedRanges = updates.map(update => update.range);

    return {
      content: [
        {
          type: "text",
          text: `Successfully batch updated ${updates.length} range(s): [${updatedRanges.join(", ")}]. ` +
                `Updated ${totalUpdatedCells} cell(s), ${totalUpdatedRows} row(s), ${totalUpdatedColumns} column(s) across ${totalUpdatedSheets} sheet(s).`,
        },
      ],
      isError: false,
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error performing batch update on spreadsheet: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
}
