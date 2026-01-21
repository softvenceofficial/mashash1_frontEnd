import { baseApi } from "../api";
import type { IBook, IBookDetails, IStyle, IGeneratedImage } from "@/types/book.type";

export const bookApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getBooks: build.query<{ data: IBook[] }, void>({
      query: () => ({
        url: "/books/",
        method: "GET",
      }),
      providesTags: ["book"],
    }),

    createBook: build.mutation<{ data: IBook }, FormData>({
      query: (data) => ({
        url: "/books/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["book"],
    }),

    updateBook: build.mutation<{ data: IBook }, { id: number; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/book/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["book"],
    }),

    deleteBook: build.mutation<void, number>({
      query: (id) => ({
        url: `/book/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["book"],
    }),

    getBookDetails: build.query<{ data: IBookDetails }, string>({
      query: (id) => ({
        url: `/book/details/${id}/`,
        method: "GET",
      }),
      providesTags: ["book"],
    }),

    getStyles: build.query<{ data: IStyle[] }, void>({
      query: () => ({
        url: "/styles/",
        method: "GET",
      }),
    }),

    generateImage: build.mutation<IGeneratedImage, { book_id: number; style_id: number; size_id: number; prompt: string }>({
      query: ({ book_id, ...data }) => ({
        url: `/generate/${book_id}/`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetBooksQuery,
  useCreateBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
  useGetBookDetailsQuery,
  useGetStylesQuery,
  useGenerateImageMutation,
} = bookApi;
