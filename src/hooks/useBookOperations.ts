import { useCallback } from "react";
import { toast } from "sonner";
import {
  useDeleteBookMutation,
  useRestoreBookMutation,
  useDeleteBookPermanentlyMutation,
  useShareBookMutation,
} from "@/redux/endpoints/bookApi";
import { handleApiError } from "@/utils/apiHelper";

export const useBookOperations = () => {
  const [deleteBook] = useDeleteBookMutation();
  const [restoreBook] = useRestoreBookMutation();
  const [deleteBookPermanently] = useDeleteBookPermanentlyMutation();
  const [shareBook] = useShareBookMutation();

  const handleDeleteBook = useCallback(
    async (bookId: number) => {
      try {
        await deleteBook(bookId).unwrap();
        toast.success("Book moved to trash");
        return true;
      } catch (error) {
        toast.error(handleApiError(error));
        return false;
      }
    },
    [deleteBook]
  );

  const handleRestoreBook = useCallback(
    async (bookId: number) => {
      try {
        await restoreBook(bookId).unwrap();
        toast.success("Book restored successfully");
        return true;
      } catch (error) {
        toast.error(handleApiError(error));
        return false;
      }
    },
    [restoreBook]
  );

  const handleDeletePermanently = useCallback(
    async (bookId: number) => {
      try {
        await deleteBookPermanently(bookId).unwrap();
        toast.success("Book deleted permanently");
        return true;
      } catch (error) {
        toast.error(handleApiError(error));
        return false;
      }
    },
    [deleteBookPermanently]
  );

  const handleShareBook = useCallback(
    async (bookId: number) => {
      try {
        const response = await shareBook(bookId).unwrap();
        return response.data;
      } catch (error) {
        toast.error(handleApiError(error));
        return null;
      }
    },
    [shareBook]
  );

  return {
    handleDeleteBook,
    handleRestoreBook,
    handleDeletePermanently,
    handleShareBook,
  };
};
