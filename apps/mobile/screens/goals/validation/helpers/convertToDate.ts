export default function convertToDate(value: string): Date | undefined {
  const parsed = new Date(value);
  return !isNaN(parsed.getTime()) ? parsed : undefined;
}
