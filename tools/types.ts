// Define base types for our tool system
export interface Tool<T> {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties: Record<string, unknown>;
    required: readonly string[];
  };
  handler: (args: T) => Promise<InternalToolResponse>;
}

// Our internal tool response format
export interface InternalToolResponse {
  content: {
    type: string;
    text: string;
  }[];
  isError: boolean;
}

// Input types for each tool
export interface GDriveSearchInput {
  query: string;
  pageToken?: string;
  pageSize?: number;
}

export interface GDriveReadFileInput {
  fileId: string;
}

export interface GSheetsUpdateCellInput {
  fileId: string;
  range: string;
  value: string;
}

export interface GSheetsReadInput {
  spreadsheetId: string;
  ranges?: string[]; // Optional A1 notation ranges like "Sheet1!A1:B10"
  sheetId?: number; // Optional specific sheet ID
}

export interface GSheetsAppendRowInput {
  fileId: string;
  range: string; // A1 notation range to search for the table (e.g., 'Sheet1!A:A' or 'Sheet1!A1:Z1')
  values: string[]; // Array of values to append as a new row
  valueInputOption?: 'RAW' | 'USER_ENTERED' | 'INPUT_VALUE_OPTION_UNSPECIFIED'; // How input data should be interpreted
  insertDataOption?: 'OVERWRITE' | 'INSERT_ROWS'; // How data should be inserted
}

