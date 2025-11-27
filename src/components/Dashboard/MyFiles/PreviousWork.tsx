import WorkingCard from "@/components/common/WorkingCard";
import cardBook from "@/assets/images/cardBook.png";

export default function PreviousWork() {
  return (
    <section className="mt-10">
      <h4 className="text-lg font-medium mb-7">Previous Work</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-15">
        {workingData.map((work) => (
          <WorkingCard key={work.id} work={work} />
        ))}
      </div>
    </section>
  );
}


const workingData = [
  {
    id: 1,
    title: "My lil star...",
    date: "17/11/2025",
    imageUrl: cardBook,
  },
  {
    id: 2,
    title: "Tiny moments",
    date: "19/10/2025",
    imageUrl: cardBook,
  },
  {
    id: 3,
    title: "Sweet memories",
    date: "02/11/2023",
    imageUrl: cardBook,
  },
  {
    id: 4,
    title: "Smiling days",
    date: "10/12/2023",
    imageUrl: cardBook,
  },
  {
    id: 5,
    title: "Little stories",
    date: "05/01/2024",
    imageUrl: cardBook,
  },
];
