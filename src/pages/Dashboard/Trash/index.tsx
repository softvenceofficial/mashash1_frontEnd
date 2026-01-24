import BackButton from "@/components/common/BackButton";
import WorkingCard from "@/components/common/WorkingCard";
import { useGetTrashBooksQuery } from "@/redux/endpoints/bookApi";
import { Skeleton } from "@/components/ui/skeleton";

export default function TrashPage() {
  const { data: trashData, isLoading } = useGetTrashBooksQuery();
  const getImageUrl = (path: string | null) => {
  if (!path) return "";
  
  return path
    .replace("https:/", "https://")  
    .replace("/api/", "/");          
};
  return (
    <div>
      <BackButton />
      <h1 className="text-2xl font-bold mt-4 mb-6">Trash</h1>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-10 mr-5 mt-10">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[280px] w-full rounded-xl" />
          ))}
        </div>
      ) : trashData?.data?.length === 0 ? (
        <p className="text-gray-500 mt-10">Trash is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-10 mr-5 mt-10">
          {trashData?.data?.map((work) => (
            <WorkingCard
              key={work.id}
              work={{
                id: work.id,
                title: work.title,
                date: new Date(work.created_at).toLocaleDateString("en-GB"),
                imageUrl: getImageUrl(work.cover_image),
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
