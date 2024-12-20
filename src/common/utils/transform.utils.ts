export function safeSortField(field: string, allowedFields: string[]): string {
  if (allowedFields.includes(field)) {
    return field;
  }
  throw new Error('Invalid sort field');
}