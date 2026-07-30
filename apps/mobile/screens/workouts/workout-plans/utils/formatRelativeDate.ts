export default function formatRelativeDate(value: string) {
  const date = new Date(value);
  const differenceMs = Date.now() - date.getTime();
  const differenceDays = Math.floor(differenceMs / (1000 * 60 * 60 * 24));

  if (differenceDays <= 0) {
    return "today";
  }

  if (differenceDays === 1) {
    return "yesterday";
  }

  if (differenceDays < 7) {
    return `${differenceDays} days ago`;
  }

  return date.toLocaleDateString();
}
