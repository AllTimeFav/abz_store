const colorMap: Record<string, string> = {
  '#FF0000': 'Red',
  '#008000': 'Green',
  '#0000FF': 'Blue',
  '#FFFF00': 'Yellow',
  '#FFA500': 'Orange',
  '#800080': 'Purple',
  '#000000': 'Black',
  '#FFFFFF': 'White',
  '#808080': 'Gray',
  '#FFC0CB': 'Pink',
  '#A52A2A': 'Brown',
  '#008080': 'Teal',
  '#FFD700': 'Gold',
}

export const getColorName = (hex: string): string => {
  return colorMap[hex.toUpperCase()] || hex // Fallback to hex if not found
}
