import { schema as gdriveSearchSchema, search } from './gdrive_search.js';
import { schema as gdriveReadFileSchema, readFile } from './gdrive_read_file.js';
import { schema as gsheetsUpdateCellSchema, updateCell } from './gsheets_update_cell.js';
import { schema as gsheetsReadSchema, readSheet } from './gsheets_read.js';
import { schema as gsheetsAppendRowSchema, appendRow } from './gsheets_append_row.js';
import { schema as gsheetsBatchUpdateSchema, batchUpdate } from './gsheets_batch_update.js';
export const tools = [
    {
        ...gdriveSearchSchema,
        handler: search,
    },
    {
        ...gdriveReadFileSchema,
        handler: readFile,
    },
    {
        ...gsheetsUpdateCellSchema,
        handler: updateCell,
    },
    {
        ...gsheetsReadSchema,
        handler: readSheet,
    },
    {
        ...gsheetsAppendRowSchema,
        handler: appendRow,
    },
    {
        ...gsheetsBatchUpdateSchema,
        handler: batchUpdate,
    }
];
