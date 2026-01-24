import Icon from "@/components/common/Icon";
import bg from "@/assets/svgs/dashboard-home-bg.svg";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { useGetBooksQuery, useDeleteBookMutation } from "@/redux/endpoints/bookApi";
import { Loader2, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

export default function DashboardPage() {
  const { data: booksData, isLoading } = useGetBooksQuery();
  const [deleteBook] = useDeleteBookMutation();

  const getImageUrl = (path: string | null) => {
  if (!path) return "";
  
  return path
    .replace("https:/", "https://")  
    .replace("/api/", "/");          
};

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this book?")) {
      try {
        await deleteBook(id).unwrap();
        toast.success("Book deleted successfully");
      } catch (error) {
        toast.error("Failed to delete book");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center mt-20">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  const books = booksData?.data || [];

  return (
    <section className="space-y-5 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Artbooks</h1>
        <Link to="/Creator">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create New Artbook
          </Button>
        </Link>
      </div>

      {books.length === 0 ? (
        <div className="max-w-md mx-auto mt-20 text-center">
          <Icon src={bg} className="text-[#454F5B] mx-auto" />
          <p className="text-base font-normal text-secondary-foreground mt-3">
            Nothing here yet. Bring your ideas to life with a new artbook.
          </p>
          <div className="flex justify-center mt-7">
            <Link to="/Creator">
              <Button variant="default" className="mt-4">
                First New Artbook
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-6 mt-6 ">
          {books.map((book) => (
            <div
              key={book.id}
              className="group relative border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all bg-white "
            >
              <Link to={`/Creator/${book.id}`}>
                <div className=" bg-gray-100 relative overflow-hidden ">
                  {book.cover_image ? (
                    <img
                      src={getImageUrl(book.cover_image)}
                      alt={book.title}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Cover
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold truncate text-black" title={book.title}>
                    {book.title || "Untitled Book"}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Created: {new Date(book.created_at).toLocaleDateString()}
                  </p>
                </div>
              </Link>

              <button
                onClick={(e) => handleDelete(e, book.id)}
                className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-red-50 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}