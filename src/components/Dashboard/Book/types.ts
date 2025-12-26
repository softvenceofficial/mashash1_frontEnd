export interface TextType {
  id: string;
  x: number;
  y: number;
  text: string;
  fontSize: number;
  fontFamily: string;
  fill: string;
  fontStyle?: 'bold' | 'italic' | 'bold italic' | 'normal';
  textDecoration?: 'underline' | 'line-through' | 'none';
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  width?: number;
  lineHeight?: number;
  letterSpacing?: number;
  rotation?: number;
  opacity?: number;
  isEditing?: boolean;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  shadowOpacity?: number;
  stroke?: string;
  strokeWidth?: number;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  listType?: 'none' | 'bullet' | 'number';
}

export interface LineType {
  type: string;
  tool: string;
  points: number[];
  color: string;
  width: number;
}

export interface ShapeType {
  id: string;
  type: 'rect' | 'circle';
  x: number;
  y: number;
  fill: string;
}

export interface StickyNoteType {
  id: string;
  type: 'sticky-note';
  x: number;
  y: number;
  width: number;
  height: number;
  collapsedWidth: number;
  collapsedHeight: number;
  isExpanded: boolean;
  text: string;
  color: string;
  textColor: string;
  fontSize: number;
  fontFamily: string;
  rotation?: number;
}

export interface TableCell {
  id: string;
  content: string;
  fontSize: number;
  fontFamily: string;
  fill: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  alignment: 'left' | 'center' | 'right';
  verticalAlign: 'top' | 'middle' | 'bottom';
  backgroundColor: string;
  rowSpan?: number;
  colSpan?: number;
}

export interface TableType {
  id: string;
  type: 'table';
  x: number;
  y: number;
  rows: number;
  cols: number;
  cellWidth: number;
  cellHeight: number;
  borderWidth: number;
  borderColor: string;
  fillColor: string;
  data: TableCell[][];
  selectedCell: { row: number; col: number } | null;
}

export interface PageData {
  lines: LineType[];
  texts: TextType[];
  shapes: ShapeType[];
  background?: string;
}

export const TEXT_PRESETS = [
  { name: 'Heading 1', fontSize: 32, fontFamily: 'Roboto', fontStyle: 'bold' as const, fill: '#000000' },
  { name: 'Heading 2', fontSize: 24, fontFamily: 'Roboto', fontStyle: 'bold' as const, fill: '#333333' },
  { name: 'Body Text', fontSize: 16, fontFamily: 'Roboto', fontStyle: 'normal' as const, fill: '#555555' },
  { name: 'Caption', fontSize: 12, fontFamily: 'Roboto', fontStyle: 'italic' as const, fill: '#777777' }
];
