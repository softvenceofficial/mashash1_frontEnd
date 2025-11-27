import { Card, CardContent, CardFooter } from "../ui/card";
import ThreeDotButton from "./ThreeDotButton";

export default function WorkingCard({
  work,
}: {
  work: { id: number; title: string; date: string; imageUrl: string };
}) {
  return (
    <Card className="dark:bg-[#212B36] border-none p-4 mr-6 relative">
      <div className="absolute top-0 -right-8">
        <ThreeDotButton />
      </div>
      <CardContent className="px-0">
        <img src={work.imageUrl} alt={work.title} className="w-full h-auto" />
      </CardContent>
      <CardFooter className="flex justify-between items-center bg-background dark:bg-black rounded-md p-2.5 text-sm font-normal">
        <p>{work.title}</p>
        <p>{work.date}</p>
      </CardFooter>
    </Card>
  );
}
