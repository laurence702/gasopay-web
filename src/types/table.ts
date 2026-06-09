export interface ColumnDefinition {
  key: string;
  label: string;
  sortable?: boolean;
  formatter?: (value: TableRow[keyof TableRow], row: TableRow) => string;
  // Add other properties as needed, e.g., for custom cell rendering
  cellClass?: string | ((value: TableRow[keyof TableRow], row: TableRow) => string);
  headerClass?: string;
}

export interface TableRow {
  [key: string]: string | number | boolean | null | undefined | TableRow | TableRow[];
}

export type SortDirection = 'asc' | 'desc' | null; 