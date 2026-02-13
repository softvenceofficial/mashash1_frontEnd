import { baseApi } from "../api";
import type { IBook, IBookDetails, IStyle, IGeneratedImage, IApiResponse, IBookSize } from "@/types/book.type";

export const bookApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getBooks: build.query<IApiResponse<IBook[]>, void>({
      query: () => ({
        url: "/books/",
        method: "GET",
      }),
      providesTags: ["book"],
    }),

    createBook: build.mutation<IApiResponse<IBook>, FormData>({
      query: (data) => ({
        url: "/books/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["book", "recent-work"],
    }),

    updateBook: build.mutation<IApiResponse<IBook>, { id: number; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/book/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["book", "recent-work", "previous-work"],
    }),

    deleteBook: build.mutation<IApiResponse<void>, number>({
      query: (id) => ({
        url: `/book/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["book", "recent-work", "previous-work", "trash"],
    }),

    getBookDetails: build.query<IApiResponse<IBookDetails>, string>({
      query: (id) => ({
        url: `/book/details/${id}/`,
        method: "GET",
      }),
      providesTags: ["book"],
    }),

    getRecentWorks: build.query<IApiResponse<IBook[]>, void>({
      query: () => ({
        url: "/recent-works/",
        method: "GET",
      }),
      providesTags: ["recent-work"],
    }),

    getPreviousWorks: build.query<IApiResponse<IBook[]>, void>({
      query: () => ({
        url: "/previous-works/",
        method: "GET",
      }),
      providesTags: ["previous-work"],
    }),

    getTrashBooks: build.query<IApiResponse<IBook[]>, void>({
      query: () => ({
        url: "/trash/",
        method: "GET",
      }),
      providesTags: ["trash"],
    }),

    deleteBookPermanently: build.mutation<IApiResponse<void>, number>({
      query: (id) => ({
        url: `/trash/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["trash"],
    }),

    getStyles: build.query<IApiResponse<IStyle[]>, void>({
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

    getBookSizes: build.query<IApiResponse<IBookSize[]>, void>({
      query: () => ({
        url: "/book-size/",
        method: "GET",
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
  useGetRecentWorksQuery,
  useGetPreviousWorksQuery,
  useGetTrashBooksQuery,
  useDeleteBookPermanentlyMutation,
  useGetStylesQuery,
  useGenerateImageMutation,
  useGetBookSizesQuery,
} = bookApi;
