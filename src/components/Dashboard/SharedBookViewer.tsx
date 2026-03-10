import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useGetSharedBookQuery } from "@/redux/endpoints/bookApi";
import Book from "@/components/Dashboard/Book/Book";
import { Loader2 } from "lucide-react";

export const SharedBookViewer = () => {
  const { token } = useParams<{ token: string }>();
  const { data: sharedRes, isLoading, error } = useGetSharedBookQuery(token as string, {
    skip: !token,
  });

  const [bookData, setBookData] = useState<any>(null);
  const [isFetchingFile, setIsFetchingFile] = useState(false);

  useEffect(() => {
    // The API returns a URL to a JSON file. We need to fetch the actual JSON data.
    const fetchBookJson = async () => {
      if (sharedRes?.data?.file) {
        setIsFetchingFile(true);
        try {
          // ensure https is used
          const fileUrl = sharedRes.data.file.replace("http://", "https://");
          const response = await fetch(fileUrl);
          const jsonData = await response.json();
          setBookData(jsonData);
        } catch (err) {
          console.error("Failed to load book data file:", err);
        } finally {
          setIsFetchingFile(false);
        }
      }
    };

    fetchBookJson();
  }, [sharedRes]);

  if (isLoading || isFetchingFile) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black">
        <Loader2 className="animate-spin text-white w-12 h-12" />
      </div>
    );
  }

  if (error || !bookData) {
    return <div className="text-white text-center p-10 bg-black min-h-screen">Failed to load shared book. Invalid or expired link.</div>;
  }

  return (
    <div className="h-screen w-screen bg-black overflow-hidden flex items-center justify-center m-0 p-0">
      <Book 
        initialData={bookData} 
        /* @ts-ignore */
        isReadOnly={true} 
      />
    </div>
  );
};
