import type { TextTemplate } from "../types/book.types";

export const TEXT_TEMPLATES: TextTemplate[] = [
  { label: "Title", fontSize: 32, bold: true, width: 300, height: 50 },
  { label: "Heading", fontSize: 24, bold: true, width: 250, height: 40 },
  { label: "Body", fontSize: 16, bold: false, width: 200, height: 100 },
  { label: "Caption", fontSize: 12, italic: true, width: 150, height: 30 },
];
