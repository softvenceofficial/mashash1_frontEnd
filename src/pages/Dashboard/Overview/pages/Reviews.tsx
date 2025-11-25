import { Button } from "@/components/ui/button";
import DeleteIcon from "@/assets/svgs/delete.svg?react";
import ReviewCard from "@/components/Dashboard/Cards/ReviewCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Reviews() {
  return (
    <section>
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="positive">Positive</TabsTrigger>
          <TabsTrigger value="critical">Critical</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Reviews(220)</h2>

            <div className="flex items-center gap-4">
              <p className="text-muted-foreground">5 Selected</p>
              <p className="text-muted-foreground">Select all</p>
              <Button>
                <DeleteIcon />
                Delete
              </Button>
              <p className="text-lg font-semibold">4.3 Ratting</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-6">
            {[...Array(50)].map((_, i) => (
              <ReviewCard key={i} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
