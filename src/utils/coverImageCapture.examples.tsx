/**
 * USAGE EXAMPLES FOR COVER IMAGE CAPTURE
 * 
 * Your implementation in Creator/index.tsx is already working correctly!
 * This file shows alternative usage patterns if needed elsewhere.
 */

import { captureCoverImage, createCoverFormData } from "@/utils/coverImageCapture";
import { useUpdateBookMutation } from "@/redux/endpoints/bookApi";

// ============================================
// EXAMPLE 1: Basic Cover Capture (Already implemented in Creator)
// ============================================
export const SaveBookWithCover = () => {
  const bookRef = useRef<any>(null);
  const [updateBook] = useUpdateBookMutation();

  const handleSave = async () => {
    // Get cover image from Konva
    const coverFile = await captureCoverImage(() => bookRef.current?.getCoverImage());
    
    if (coverFile) {
      const formData = new FormData();
      formData.append("cover_image", coverFile);
      formData.append("title", "My Book");
      
      await updateBook({ id: 123, data: formData });
    }
  };

  return <button onClick={handleSave}>Save</button>;
};

// ============================================
// EXAMPLE 2: Using the Helper Function
// ============================================
export const SaveWithHelper = () => {
  const bookRef = useRef<any>(null);
  const [updateBook] = useUpdateBookMutation();

  const handleSave = async () => {
    const formData = await createCoverFormData(
      () => bookRef.current?.getCoverImage(),
      { title: "My Book", book_id: 123 }
    );
    
    if (formData) {
      await updateBook({ id: 123, data: formData });
    }
  };

  return <button onClick={handleSave}>Save</button>;
};

// ============================================
// EXAMPLE 3: Manual HTML Element Capture (Alternative)
// ============================================
import html2canvas from "html2canvas";
import { blobToFile } from "@/utils/imageUploadHelper";

export const CaptureHTMLCover = () => {
  const coverRef = useRef<HTMLDivElement>(null);

  const captureCover = async () => {
    if (!coverRef.current) return null;

    const canvas = await html2canvas(coverRef.current, {
      useCORS: true,
      scale: 2,
    });

    return new Promise<File | null>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const file = blobToFile(blob, "cover.png");
          resolve(file);
        } else {
          resolve(null);
        }
      }, "image/png");
    });
  };

  return (
    <div ref={coverRef} className="w-full h-full">
      {/* Your cover content */}
    </div>
  );
};

// ============================================
// EXAMPLE 4: Auto-save on Changes
// ============================================
export const AutoSaveCover = () => {
  const bookRef = useRef<any>(null);
  const [updateBook] = useUpdateBookMutation();
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    const autoSave = setInterval(async () => {
      const formData = await createCoverFormData(
        () => bookRef.current?.getCoverImage()
      );
      
      if (formData) {
        await updateBook({ id: 123, data: formData });
        setLastSaved(new Date());
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSave);
  }, []);

  return <div>Last saved: {lastSaved?.toLocaleTimeString()}</div>;
};
