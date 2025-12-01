import { Card, CardContent } from "@/components/ui/card";
import assets from "@/assets";

export default function ServiceCard() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <img
          src={assets.image.DefaultPlaceholder}
          alt="service"
          className="w-full h-32 object-cover"
        />
        <div className="p-3 space-y-1">
          <h5 className="font-semibold">Service Name</h5>
          <p className="text-sm text-muted-foreground">$50</p>
        </div>
      </CardContent>
    </Card>
  );
}
