import { useGetRecentWorksQuery } from "@/redux/endpoints/bookApi";
import WorkingCard from "@/components/common/WorkingCard";
import { Skeleton } from "@/components/ui/skeleton";
import { getImageUrl } from "@/lib/utils";

export default function RecentWork() {
  const { data: recentWorksData, isLoading } = useGetRecentWorksQuery();

  if (isLoading) {
    return (
      <section>
        <h4 className="text-lg font-medium mb-7">Recent Work</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-10 mr-5">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[280px] w-full rounded-xl" />
          ))}
        </div>
      </section>
    );
  }

  const works = recentWorksData?.data || [];

  return (
    <section>
      <h4 className="text-lg font-medium mb-7">Recent Work</h4>
      {works.length === 0 ? (
        <p className="text-gray-500 text-sm">No recent works found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-10 mr-5">
          {works.map((work) => (
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
    </section>
  );
}
