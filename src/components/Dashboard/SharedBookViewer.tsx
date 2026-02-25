import { useGetSharedBookQuery } from "@/redux/endpoints/bookApi";
import { useParams } from "react-router";
import { Loader } from "lucide-react";

export const SharedBookViewer = () => {
  const { token } = useParams<{ token: string }>();
  const { data, isLoading, error } = useGetSharedBookQuery(token || "", {
    skip: !token,
  });

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600">Invalid share link</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin" size={40} />
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600">Failed to load shared book</p>
      </div>
    );
  }

  const book = data.data;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
          <p className="text-gray-600">
            Created on {new Date(book.created_at).toLocaleDateString()}
          </p>
        </div>

        {book.cover_image && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <img
              src={book.cover_image}
              alt={book.title}
              className="w-full max-h-96 object-cover rounded-lg"
            />
          </div>
        )}

        {book.images && book.images.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Book Pages</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {book.images.map((image) => (
                <div key={image.id} className="rounded-lg overflow-hidden shadow">
                  <img
                    src={image.image}
                    alt={`Page ${image.id}`}
                    className="w-full h-64 object-cover hover:scale-105 transition-transform"
                  />
                  <p className="text-xs text-gray-500 p-2">
                    {new Date(image.generated_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
