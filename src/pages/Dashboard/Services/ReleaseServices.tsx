import { Button } from "@/components/ui/button";
import DeleteIcon from "@/assets/svgs/delete.svg?react";
import AddIcon from "@/assets/svgs/add.svg?react";
import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router";
import assets from "@/assets";
import DialogWrapper from "@/components/DialogContents";
import DeleteService from "./dialogs/DeleteService";
import { DataTable } from "@/components/DataTable/DataTable";

export default function ReleaseServices() {
  type TServiceData = {
    id: number;
    logo: string;
    title: string;
    category: string;
    price: number;
    rating: number;
    reviews: number;
  };
  const servicesData: TServiceData[] = [
    {
      id: 1,
      logo: "SkyNet Services",
      title: "Web Design Services",
      category: "Design",
      price: 45,
      rating: 4.5,
      reviews: 85,
    },
    {
      id: 2,
      logo: "AquaTech Solutions",
      title: "SEO Optimization",
      category: "Marketing",
      price: 67,
      rating: 4.8,
      reviews: 200,
    },
    {
      id: 3,
      logo: "NovaWave Innovations",
      title: "Content Creation",
      category: "Content",
      price: 32,
      rating: 3.7,
      reviews: 50,
    },
    {
      id: 4,
      logo: "EcoSphere Dynamics",
      title: "Social Media Management",
      category: "Marketing",
      price: 89,
      rating: 5.0,
      reviews: 300,
    },
    {
      id: 5,
      logo: "QuantumLeap Technologies",
      title: "Email Marketing Solutions",
      category: "Marketing",
      price: 54,
      rating: 4.6,
      reviews: 150,
    },
    {
      id: 6,
      logo: "BrightFuture Consulting",
      title: "Graphic Design Services",
      category: "Design",
      price: 73,
      rating: 4.2,
      reviews: 75,
    },
    {
      id: 7,
      logo: "Pinnacle Systems",
      title: "E-commerce Solutions",
      category: "Development",
      price: 28,
      rating: 4.9,
      reviews: 250,
    },
    {
      id: 8,
      logo: "FusionWorks Enterprises",
      title: "Mobile App Development",
      category: "Development",
      price: 91,
      rating: 3.5,
      reviews: 40,
    },
    {
      id: 9,
      logo: "Vertex Solutions",
      title: "Cloud Hosting Services",
      category: "IT",
      price: 38,
      rating: 4.3,
      reviews: 130,
    },
    {
      id: 10,
      logo: "Horizon Strategies",
      title: "Digital Marketing Strategies",
      category: "Marketing",
      price: 60,
      rating: 5.0,
      reviews: 500,
    },
  ];

  const columns: ColumnDef<TServiceData>[] = [
    {
      accessorKey: "title",
      header: "Service Logo & Title",
      cell: ({ row }) => (
        <div className="flex items-center gap-4">
          <img
            src={assets.image.DefaultPlaceholder}
            alt="Logo"
            className="size-10 rounded-full"
          />
          <p>{row.original.title}</p>
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Service Category",
      cell: ({ row }) => (
        <p className="text-primary">{row.original.category}</p>
      ),
    },
    {
      accessorKey: "price",
      header: "Service Price ",
    },
    {
      accessorKey: "rating",
      header: "Ratings",
      cell: ({ row }) => (
        <div>
          {row.original.rating} ({row.original.reviews})
        </div>
      ),
    },
  ];

  return (
    <section>
      <h3 className="text-2xl font-semibold mb-10">Service Page</h3>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-semibold">All Services</h2>
        <div className="flex items-center gap-6">
          <p className="text-muted-foreground">Select</p>
          <Button>
            <DeleteIcon />
            Delete
          </Button>
          <Link to="/dashboard/services/add">
            <Button className="ml-10">
              <AddIcon />
              Add
            </Button>
          </Link>
        </div>
      </div>

      <div>
        <DataTable<TServiceData>
          data={servicesData!}
          columns={columns}
          limit={20}
          page={1}
          total={servicesData.length}
          onLimitChange={() => {}}
          onPageChange={() => {}}
          isPagination={false}
          actions={(row) => (
            <div className="space-x-4">
              <Link to="/dashboard/services/add">
                <Button>Edit Service</Button>
              </Link>
              <DialogWrapper
                dialogKey={`service-delete-${row.id}`}
                trigger={
                  <Button variant="ghost">
                    <DeleteIcon />
                  </Button>
                }
                content={
                  <DeleteService dialogId={`service-delete-${row.id}`} />
                }
              />
            </div>
          )}
        />
      </div>
    </section>
  );
}
