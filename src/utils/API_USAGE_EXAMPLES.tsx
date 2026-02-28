/**
 * EXAMPLE USAGE PATTERNS FOR API INTEGRATION
 * 
 * This file demonstrates how to use the implemented APIs in your components.
 * Copy and adapt these patterns for your specific use cases.
 */

import { useState } from "react";
import { toast } from "sonner";
import { useUserLoginMutation } from "@/redux/endpoints/authApi";
import { useGetBooksQuery, useCreateBookMutation, useGenerateImageMutation, useGetStylesQuery, useGetBookSizesQuery, useGetTrashBooksQuery, useDeleteBookPermanentlyMutation, useGetBookDetailsQuery, useGetPreviousWorksQuery } from "@/redux/endpoints/bookApi";
import { createFormData, handleApiError, isApiSuccess } from "@/utils/apiHelper";
import { ShareModal } from "@/components/Modal/ShareModal";
import { useBookOperations } from "@/hooks/useBookOperations";

// ============================================================================
// EXAMPLE 1: Login Component
// ============================================================================
export const LoginExample = () => {
  const [login, { isLoading }] = useUserLoginMutation();

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await login({ email, password }).unwrap();
      toast.success("Login successful!");
      // User data and tokens are automatically stored in Redux
      console.log("User:", response.data);
    } catch (error: any) {
      toast.error(error?.data?.message || "Login failed");
    }
  };

  return (
    <button onClick={() => handleLogin("user@example.com", "password")} disabled={isLoading}>
      {isLoading ? "Logging in..." : "Login"}
    </button>
  );
};

// ============================================================================
// EXAMPLE 2: Book List Component
// ============================================================================
export const BookListExample = () => {
  const { data, isLoading, error } = useGetBooksQuery();

  if (isLoading) return <div>Loading books...</div>;
  if (error) return <div>Error loading books</div>;

  return (
    <div>
      {data?.data?.map((book) => (
        <div key={book.id}>
          <h3>{book.title}</h3>
          {book.cover_image && <img src={book.cover_image} alt={book.title} />}
        </div>
      ))}
    </div>
  );
};

// ============================================================================
// EXAMPLE 3: Create Book Component
// ============================================================================
export const CreateBookExample = () => {
  const [createBook, { isLoading }] = useCreateBookMutation();
  const [title, setTitle] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);

  const handleCreate = async () => {
    try {
      const formData = createFormData({
        title,
        cover_image: coverImage,
      });

      const response = await createBook(formData).unwrap();
      toast.success("Book created successfully!");
      console.log("New book:", response.data);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create book");
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Book title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="file"
        onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
      />
      <button onClick={handleCreate} disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Book"}
      </button>
    </div>
  );
};

// ============================================================================
// EXAMPLE 4: Generate Image Component
// ============================================================================
export const GenerateImageExample = () => {
  const [generateImage, { isLoading }] = useGenerateImageMutation();
  const { data: styles } = useGetStylesQuery();
  const { data: sizes } = useGetBookSizesQuery();
  const [prompt, setPrompt] = useState("");
  const [styleId, setStyleId] = useState<number | null>(null);
  const [sizeId, setSizeId] = useState<number | null>(null);

  const handleGenerate = async (bookId: number) => {
    if (!styleId || !sizeId) {
      toast.error("Please select style and size");
      return;
    }

    try {
      const response = await generateImage({
        book_id: bookId,
        style_id: styleId,
        size_id: sizeId,
        prompt,
      }).unwrap();

      toast.success("Image generated successfully!");
      console.log("Generated image:", response);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to generate image");
    }
  };

  return (
    <div>
      <select onChange={(e) => setStyleId(Number(e.target.value))}>
        <option>Select Style</option>
        {styles?.data?.map((style) => (
          <option key={style.id} value={style.id}>
            {style.name}
          </option>
        ))}
      </select>

      <select onChange={(e) => setSizeId(Number(e.target.value))}>
        <option>Select Size</option>
        {sizes?.data?.map((size) => (
          <option key={size.id} value={size.id}>
            {size.name}
          </option>
        ))}
      </select>

      <textarea
        placeholder="Enter prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button onClick={() => handleGenerate(1)} disabled={isLoading}>
        {isLoading ? "Generating..." : "Generate Image"}
      </button>
    </div>
  );
};

// ============================================================================
// EXAMPLE 5: Share Book Component
// ============================================================================
export const ShareBookExample = () => {
  const [showShareModal, setShowShareModal] = useState(false);
  const bookId = 1;

  return (
    <div>
      <button onClick={() => setShowShareModal(true)}>Share Book</button>
      {showShareModal && (
        <ShareModal bookId={bookId} onClose={() => setShowShareModal(false)} />
      )}
    </div>
  );
};

// ============================================================================
// EXAMPLE 6: Book Operations with Custom Hook
// ============================================================================
export const BookActionsExample = () => {
  const { handleDeleteBook, handleRestoreBook, handleShareBook } = useBookOperations();

  const handleDelete = async (bookId: number) => {
    const success = await handleDeleteBook(bookId);
    if (success) {
      console.log("Book deleted");
    }
  };

  const handleRestore = async (bookId: number) => {
    const success = await handleRestoreBook(bookId);
    if (success) {
      console.log("Book restored");
    }
  };

  const handleShare = async (bookId: number) => {
    const shareData = await handleShareBook(bookId);
    if (shareData) {
      console.log("Share URL:", shareData.share_url);
    }
  };

  return (
    <div>
      <button onClick={() => handleDelete(1)}>Delete Book</button>
      <button onClick={() => handleRestore(1)}>Restore Book</button>
      <button onClick={() => handleShare(1)}>Share Book</button>
    </div>
  );
};

// ============================================================================
// EXAMPLE 7: Trash Management Component
// ============================================================================
export const TrashManagementExample = () => {
  const { data: trashBooks, isLoading } = useGetTrashBooksQuery();
  const [deleteBookPermanently] = useDeleteBookPermanentlyMutation();

  const handlePermanentDelete = async (bookId: number) => {
    if (window.confirm("Are you sure? This cannot be undone.")) {
      try {
        await deleteBookPermanently(bookId).unwrap();
        toast.success("Book deleted permanently");
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to delete");
      }
    }
  };

  if (isLoading) return <div>Loading trash...</div>;

  return (
    <div>
      {trashBooks?.data?.map((book) => (
        <div key={book.id}>
          <h4>{book.title}</h4>
          <button onClick={() => handlePermanentDelete(book.id)}>
            Delete Permanently
          </button>
        </div>
      ))}
    </div>
  );
};

// ============================================================================
// EXAMPLE 8: Book Details with Images
// ============================================================================
export const BookDetailsExample = () => {
  const { data, isLoading } = useGetBookDetailsQuery("1");

  if (isLoading) return <div>Loading...</div>;

  const book = data?.data;

  return (
    <div>
      <h1>{book?.title}</h1>
      {book?.cover_image && (
        <img src={book.cover_image} alt={book.title} style={{ maxWidth: "300px" }} />
      )}

      <h2>Pages</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
        {book?.images?.map((image) => (
          <img key={image.id} src={image.image} alt={`Page ${image.id}`} />
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// EXAMPLE 9: Previous Works Component
// ============================================================================
export const PreviousWorksExample = () => {
  const { data, isLoading } = useGetPreviousWorksQuery();

  if (isLoading) return <div>Loading previous works...</div>;

  return (
    <div>
      <h2>Previous Works</h2>
      {data?.data?.map((book) => (
        <div key={book.id}>
          <h3>{book.title}</h3>
          <p>{new Date(book.created_at).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
};

// ============================================================================
// EXAMPLE 10: Error Handling Pattern
// ============================================================================
export const ErrorHandlingExample = () => {
  const [createBook] = useCreateBookMutation();

  const handleCreateWithErrorHandling = async (formData: FormData) => {
    try {
      const response = await createBook(formData).unwrap();

      if (isApiSuccess(response)) {
        toast.success(response.message);
        return response.data;
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
      console.error("API Error:", error);
    }

    return null;
  };

  return <button onClick={() => handleCreateWithErrorHandling(new FormData())}>Create</button>;
};
