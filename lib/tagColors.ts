export const TAG_COLORS = [
  '#F44336', // red
  '#F57C00', // orange
  '#4CAF50', // green
  '#2196F3', // blue
  '#9C27B0', // purple
  '#009688', // teal
  '#E91E63', // pink
  '#3F51B5', // indigo
  '#00BCD4', // cyan
  '#BE123C', // rose
  '#A16207', // yellow
  '#3F6212', // lime
  '#047857', // emerald
  '#7C2D12', // brown
  '#0369A1', // sky
  '#6D28D9', // violet
  '#A21CAF', // fuchsia
  '#B45309', // amber
  '#334155', // slate
];

export function getNextTagColor(usedColors: string[]): string {
  const available = TAG_COLORS.find(color => !usedColors.includes(color));
  return available ?? TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)];
}
