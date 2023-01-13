export const DiffBetweenTwoDatesInDays = (oldestDate: number, newestDate: number) => {
  return Math.floor((newestDate - oldestDate) / (1000 * 60 * 60 * 24));
} 