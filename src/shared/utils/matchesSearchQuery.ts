export const matchesSearchQuery = (
  query: string,
  ...fields: (string | undefined | null)[]
): boolean => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  return fields.some((field) => field?.toLowerCase().includes(normalized));
};
