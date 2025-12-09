import BackButton from "@/components/common/BackButton";
import cardBook from "@/assets/images/cardBook.png";
import WorkingCard from "@/components/common/WorkingCard";

export default function TrashPage() {
  return (
    <div>
      <BackButton />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-10 mr-5 mt-10">
        {workingData.map((work) => (
          <WorkingCard key={work.id} work={work} />
        ))}
      </div>
    </div>
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
  //   {
  //     id: 6,
  //     title: "You shine bright",
  //     date: "19/02/2024",
  //     imageUrl: cardBook,
  //   }
];
