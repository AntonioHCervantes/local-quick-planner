export const TAG_COLORS = [
  '#F44336', // red
  '#FF9800', // orange
  '#4CAF50', // green
  '#2196F3', // blue
  '#9C27B0', // purple
  '#009688', // teal
  '#E91E63', // pink
  '#3F51B5', // indigo
  '#00BCD4', // cyan
];

export function getNextTagColor(usedColors: string[]): string {
  const available = TAG_COLORS.find(color => !usedColors.includes(color));
  return available ?? TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)];
}
