export interface IApiResponse<T> {
  code: number;
  success: boolean;
  message: string;
  data: T;
}

export interface IBook {
  id: number;
  title: string;
  cover_image: string;
  file: string | null;
  created_at: string;
}

export interface IStyle {
  id: number;
  name: string;
  prompt: string;
  image: string | null;
}

export interface IGeneratedImage {
  id: number;
  image: string;
  generated_at: string;
  book?: number;
}

export interface IBookDetails extends IBook {
  images: IGeneratedImage[];
}

export interface ISize {
  id: number;
  name: string;
  width: number;
  height: number;
}

export interface IBookSize {
  id: number;
  name: string;
  size: string;
  aspect_ratio: string;
  description: string;
  image: string;
}
