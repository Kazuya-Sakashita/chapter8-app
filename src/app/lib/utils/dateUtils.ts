export const formatDate = (date: string | Date | null): string => {
  if (!date) return "日付不明";

  const formattedDate = new Date(date);
  if (isNaN(formattedDate.getTime())) return "日付不明";

  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(formattedDate);
};
