export const TAG_COLORS = [
  '#F44336', // red
  '#FF6F00', // orange
  '#4CAF50', // green
  '#2196F3', // blue
  '#9C27B0', // purple
  '#009688', // teal
  '#E91E63', // pink
  '#4F86E8', // indigo
  '#00BCD4', // cyan
  '#BE123C', // rose
  '#A16207', // yellow
  '#3F6212', // lime
  '#009688', // emerald
  '#7C2D12', // brown
  '#0369A1', // sky
  '#673AB7', // violet
  '#A21CAF', // fuchsia
  '#B45309', // amber
  '#334155', // slate
];

export function getNextTagColor(usedColors: string[]): string {
  const available = TAG_COLORS.filter(color => !usedColors.includes(color));
  const palette = available.length > 0 ? available : TAG_COLORS;
  return palette[Math.floor(Math.random() * palette.length)];
}
