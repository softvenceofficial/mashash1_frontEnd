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
  stroke?: string;
  strokeWidth?: number;
}

export interface LineType {
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
