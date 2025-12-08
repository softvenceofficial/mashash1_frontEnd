interface LineType {
  tool: string;
  points: number[];
  color: string;
  width: number;
}

interface TextType {
  id: string;
  x: number;
  y: number;
  text: string;
  fontSize: number;
  fill: string;
  fontFamily?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  align?: string;
  width?: number;
  height?: number;
  textCase?: "normal" | "uppercase";
  listType?: "none" | "bullet" | "ordered";
  locked?: boolean;
  visible?: boolean;
  name?: string;
}

interface ShapeType {
  id: string;
  type: "rect" | "circle";
  x: number;
  y: number;
  fill: string;
}

interface PageData {
  lines: LineType[];
  texts: TextType[];
  shapes: ShapeType[];
  background?: string;
}

interface TextTemplate {
  label: string;
  fontSize: number;
  bold?: boolean;
  italic?: boolean;
  width: number;
  height: number;
}

export type { LineType, TextType, ShapeType, PageData, TextTemplate };
