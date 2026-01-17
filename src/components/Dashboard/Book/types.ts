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
  zIndex?: number;
}

export interface LineType {
  type: string;
  tool: string;
  points: number[];
  color: string;
  width: number;
  zIndex?: number;
}

export interface ShapeBase {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  opacity: number;
  draggable: boolean;
  scaleX: number;
  scaleY: number;
  zIndex?: number;
}

export interface RectangleShape extends ShapeBase {
  type: 'rectangle';
  cornerRadius?: number;
}

export interface CircleShape extends ShapeBase {
  type: 'circle';
  radius: number;
}

export interface TriangleShape extends ShapeBase {
  type: 'triangle';
}

export interface LineShape extends ShapeBase {
  type: 'line';
  points: number[];
}

export interface ArrowShape extends ShapeBase {
  type: 'arrow';
  points: number[];
  pointerLength?: number;
  pointerWidth?: number;
}

export interface StarShape extends ShapeBase {
  type: 'star';
  numPoints: number;
  innerRadius: number;
  outerRadius: number;
}

export type ShapeType = RectangleShape | CircleShape | TriangleShape | LineShape | ArrowShape | StarShape;

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
  zIndex?: number;
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
  zIndex?: number;
}

export interface PageData {
  lines: LineType[];
  texts: TextType[];
  shapes: ShapeType[];
  images: ImageType[];
  stickyNotes: StickyNoteType[];
  tables: TableType[];
  background?: string;
}

// Add ImageType interface if not already defined
export interface ImageType {
  id: string;
  type: 'image';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  src: string;
  zIndex?: number;
}

export const TEXT_PRESETS = [
  { name: 'Heading 1', fontSize: 32, fontFamily: 'Roboto', fontStyle: 'bold' as const, fill: '#000000' },
  { name: 'Heading 2', fontSize: 24, fontFamily: 'Roboto', fontStyle: 'bold' as const, fill: '#333333' },
  { name: 'Body Text', fontSize: 16, fontFamily: 'Roboto', fontStyle: 'normal' as const, fill: '#555555' },
  { name: 'Caption', fontSize: 12, fontFamily: 'Roboto', fontStyle: 'italic' as const, fill: '#777777' }
];
