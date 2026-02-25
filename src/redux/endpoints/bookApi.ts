import { baseApi } from "../api";
import type { IBook, IBookDetails, IStyle, IGeneratedImage, IApiResponse, IBookSize, IShareResponse } from "@/types/book.type";

export const bookApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ---- BOOK MANAGEMENT ----
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

    // ---- DASHBOARD CATEGORIES ----
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

    restoreBook: build.mutation<IApiResponse<void>, number>({
      query: (id) => ({
        url: `/books/${id}/restore/`,
        method: "PATCH",
      }),
      invalidatesTags: ["book", "trash", "previous-work"],
    }),

    // ---- GENERATION ----
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
      invalidatesTags: ["book"],
    }),

    getBookSizes: build.query<IApiResponse<IBookSize[]>, void>({
      query: () => ({
        url: "/book-size/",
        method: "GET",
      }),
    }),

    // ---- SHARING ----
    shareBook: build.mutation<IApiResponse<IShareResponse>, number>({
      query: (id) => ({
        url: `/v1/books/${id}/share/`,
        method: "POST",
      }),
    }),

    getSharedBook: build.query<IApiResponse<IBookDetails>, string>({
      query: (token) => ({
        url: `/v1/books/shared/${token}/`,
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
  useRestoreBookMutation,
  useGetStylesQuery,
  useGenerateImageMutation,
  useGetBookSizesQuery,
  useShareBookMutation,
  useGetSharedBookQuery,
} = bookApi;
