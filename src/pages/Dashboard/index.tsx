import Icon from "@/components/common/Icon";
import bg from "@/assets/svgs/dashboard-home-bg.svg";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import {
  useGetBooksQuery,
  useDeleteBookMutation,
} from "@/redux/endpoints/bookApi";
import { Loader2, Trash2, Plus,  ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function DashboardPage() {
  const { data: booksData, isLoading } = useGetBooksQuery();
  const [deleteBook] = useDeleteBookMutation();

  const getImageUrl = (path: string | null) => {
    if (!path)
      return "https://images.unsplash.com/photo-1622308643382-706dbb20e0bf?q=80&w=1000&auto=format&fit=crop";
    return path.replace("https:/", "https://").replace("/api/", "/");
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 mt-8">
          {books.map((book) => (
            <div
              key={book.id}
              className="group relative w-full rounded-3xl bg-card/95 border border-border p-6 shadow-xl transition-all duration-500 hover:bg-card hover:-translate-y-2 [perspective:1500px]"
            >
              <button
                onClick={(e) => handleDelete(e, book.id)}
                className="absolute z-50 top-4 right-4 p-2.5 bg-destructive/10 hover:bg-destructive hover:text-white text-destructive rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                title="Delete Artbook"
              >
                <Trash2 size={18} />
              </button>

              <Link to={`/Creator/${book.id}`} className="block w-full">
                <div className="relative w-[180px] sm:w-[200px] h-[280px] mx-auto mb-8 [perspective:1200px]">
                  <div className="w-full h-full relative [transform-style:preserve-3d] transition-transform duration-700 ease-out group-hover:[transform:rotateY(-30deg)_translate(-15px,-20px)]">
                    <div className="absolute inset-0 z-20 shadow-xl group-hover:shadow-2xl transition-shadow duration-700 rounded-r-md overflow-hidden bg-muted border-l-[3px] border-border">
                      <img
                        src={getImageUrl(book.cover_image)}
                        alt={book.title || "Artbook Cover"}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-background/40 via-transparent to-foreground/20 opacity-60" />
                    </div>
                    <div className="absolute inset-0 bg-muted rounded-r-md [transform:translateZ(-40px)] shadow-none group-hover:shadow-[25px_25px_40px_rgba(0,0,0,0.6)] transition-all duration-700 border-l-[3px] border-border" />
                  </div>
                </div>

                <div className="text-left mt-2">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2
                        className="text-xl font-bold text-card-foreground leading-tight mb-1 truncate"
                        title={book.title || "Untitled Book"}
                      >
                        {book.title || "Untitled Artbook"}
                      </h2>
                      <p className="text-primary text-sm font-medium mb-5">
                        Created:{" "}
                        {new Date(book.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <span className="text-xs font-bold px-2.5 py-1 bg-primary/20 text-primary rounded-md">
                      Artbook
                    </span>
                  </div>
                  <button className="w-full py-3 bg-accent hover:bg-accent/80 border border-border rounded-xl text-accent-foreground text-sm font-semibold transition-all flex items-center justify-center gap-2 group/btn">
                    Open Artbook
                    <ArrowRight
                      size={16}
                      className="group-hover/btn:translate-x-1.5 transition-transform"
                    />
                  </button>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
