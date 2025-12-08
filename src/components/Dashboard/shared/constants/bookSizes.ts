import book1 from "@/assets/images/Books/5x7.png";
import book2 from "@/assets/images/Books/6x4.png";
import book3 from "@/assets/images/Books/6x8.png";
import book4 from "@/assets/images/Books/6x9.png";
import book5 from "@/assets/images/Books/7x10.png";
import book6 from "@/assets/images/Books/8.5x11.png";
import book7 from "@/assets/images/Books/8x10.png";
import book8 from "@/assets/images/Books/12x9.png";
import book9 from "@/assets/images/Books/Square.png";

export const BOOK_SIZE_MAP: Record<string, { width: number; height: number }> = {
  "5 x 7": { width: 350, height: 490 },
  "6 x 4": { width: 400, height: 550 },
  "6 x 8": { width: 420, height: 560 },
  "6 x 9": { width: 420, height: 630 },
  "1 x 10": { width: 280, height: 700 },
  "8.5 x 11": { width: 476, height: 616 },
  "8 x 10": { width: 560, height: 700 },
  "12 x 9": { width: 672, height: 504 },
  Square: { width: 500, height: 500 },
};

export const BOOK_SIZES = [
  { id: 1, label: "5 x 7", type: "Book", image: book1 },
  { id: 2, label: "6 x 4", type: "Book", image: book2 },
  { id: 3, label: "6 x 8", type: "Book Mockup", image: book3 },
  { id: 4, label: "6 x 9", type: "Book Mockup", image: book4 },
  { id: 5, label: "7 x 10", type: "Book Mockup", image: book5 },
  { id: 6, label: "8.5 x 11", type: "Book Mockup", image: book6 },
  { id: 7, label: "8 x 10", type: "Book Mockup", image: book7 },
  { id: 8, label: "12 x 9", type: "Book Mockup", image: book8 },
  { id: 9, label: "Square", type: "Book Mockup", image: book9 },
];
