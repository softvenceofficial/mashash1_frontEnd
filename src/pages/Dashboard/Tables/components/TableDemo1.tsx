import {
  DataTable,
  type DataTableHandle,
} from "@/components/DataTable/DataTable";
import { DataTableFilter } from "@/components/DataTable/DataTableFilter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { ColumnDef, VisibilityState } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { paymentApi, type Payment } from "./tableDemoApi";
import { Badge } from "@/components/ui/badge";
import { FilterHeader } from "@/components/DataTable/FilterHeader";

export default function TableDemo1() {
  const tableRef = useRef<DataTableHandle<Payment> | null>(null);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [data, setData] = useState<Payment[]>([]);
  const [allPayments, setAllPayments] = useState<Payment[]>([]); // Store all data for filtering
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>(""); // Status filter state
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>(""); // Payment method filter state

  // Fetch payments when page, limit, or filters change
  useEffect(() => {
    const fetchPayments = async () => {
      setIsLoading(true);
      try {
        const payments = await paymentApi.getPayments({
          page,
          limit,
          search: searchTerm || undefined,
          date: selectedDate || undefined,
        });
        console.log({ payments });

        setAllPayments(payments.data);
        setTotal(payments.total);
      } catch (error) {
        console.error("Error fetching payments:", error);
        setAllPayments([]);
        setTotal(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, [page, limit, searchTerm, selectedDate]);

  // Client-side filtering using useMemo
  const filteredPayments = useMemo(() => {
    let filtered = allPayments;

    if (statusFilter) {
      filtered = filtered.filter(
        (payment) =>
          payment.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    if (paymentMethodFilter) {
      filtered = filtered.filter(
        (payment) =>
          payment.paymentMethod?.toLowerCase() ===
          paymentMethodFilter.toLowerCase()
      );
    }

    return filtered;
  }, [allPayments, statusFilter, paymentMethodFilter]);

  // Update data when filtered data changes
  useEffect(() => {
    setData(filteredPayments);
  }, [filteredPayments]);

  const columns: ColumnDef<Payment>[] = [
    {
      accessorKey: "invoice",
      header: () => <div className="text-start">Transaction Number</div>,
      size: 150,
      cell: ({ row }) => (
        <div className="cursor-pointer truncate text-start">
          {row.getValue("invoice")}
        </div>
      ),
    },
    {
      accessorKey: "customerName",
      header: () => <div className="text-start">Customer Name</div>,
      size: 220,
      cell: ({ row }) => (
        <div className="truncate text-start">
          {row.getValue("customerName")}
        </div>
      ),
    },
    {
      accessorKey: "date",
      header: () => (
        <FilterHeader
          type="date"
          headerText="Date"
          filterValue={selectedDate}
          onFilterChange={(value) => setSelectedDate(value || null)}
          onDateTimeChange={(dateTime) =>
            setSelectedDate(dateTime ? dateTime.toISOString() : null)
          }
          initialDateTime={selectedDate ? new Date(selectedDate) : undefined}
        />
      ),
      size: 150,
      cell: ({ row }) => <div className="truncate">{row.getValue("date")}</div>,
    },
    {
      accessorKey: "amount",
      header: "Amount",
      size: 120,
      cell: ({ row }) => (
        <div className="truncate">${row.getValue("amount")}</div>
      ),
    },
    {
      accessorKey: "status",
      header: () => (
        <FilterHeader
          headerText="Status"
          filterValue={statusFilter}
          onFilterChange={setStatusFilter}
          options={[
            { value: "Paid", label: "Paid" },
            { value: "Unpaid", label: "Unpaid" },
            { value: "Save", label: "Save" },
          ]}
          allLabel="All Status"
        />
      ),
      size: 120,
      cell: ({ row }) => (
        <Badge
          className={cn("truncate px-[20px] py-1 text-sm font-normal", {
            "border border-[#0CAF60]/40 bg-[#0CAF60]/10 text-[#0CAF60]":
              row.getValue("status") === "Paid",
            "border border-[#E03137]/40 bg-[#E03137]/10 text-[#E03137]":
              row.getValue("status") === "Unpaid",
            "border border-[#285f86]/40 bg-[#285f86]/20 text-[#99b1c2]":
              row.getValue("status") === "Save",
          })}
        >
          {row.getValue("status")}
        </Badge>
      ),
    },
    {
      accessorKey: "paymentMethod",
      header: () => (
        <FilterHeader
          headerText="Payment Method"
          filterValue={paymentMethodFilter}
          onFilterChange={setPaymentMethodFilter}
          options={[
            { value: "Credit Card", label: "Credit Card" },
            { value: "Bank Transfer", label: "Bank Transfer" },
          ]}
          allLabel="All Payment Methods"
        />
      ),
      size: 150,
      cell: ({ row }) => (
        <div className="truncate">{row.getValue("paymentMethod")}</div>
      ),
    },
  ];

  const actions = (row: Payment) => {
    console.log({ row });
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 cursor-pointer p-0 hover:bg-transparent focus:ring-0 focus:ring-offset-0 focus:outline-none focus-visible:ring-0"
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="border-border border p-0">
          <DropdownMenuItem className="border-border flex cursor-pointer items-center justify-center rounded-none border-b py-3 text-base">
            View
          </DropdownMenuItem>
          <DropdownMenuItem className="border-border flex cursor-pointer items-center justify-center rounded-none border-b bg-gradient-to-b from-[#f3f8f7] to-transparent py-3 text-base hover:bg-transparent">
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem className="border-border flex cursor-pointer items-center justify-center rounded-none border-b bg-gradient-to-b from-[#f3f8f7] to-transparent py-3 text-base hover:bg-transparent">
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const handleFilterChange = (search: string) => {
    setSearchTerm(search);
    setPage(1);
  };

  const clearAllFilters = () => {
    setStatusFilter("");
    setPaymentMethodFilter("");
    setSearchTerm("");
    setSelectedDate(null);
    setPage(1);
  };

  return (
    <section className="">
      <div className="flex flex-col items-center justify-between space-y-1 lg:flex-row">
        <h1 className="text-xl font-semibold md:text-[26px]">Basic Table</h1>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-sidebar rounded-2xl py-4">
          {(statusFilter ||
            paymentMethodFilter ||
            searchTerm ||
            selectedDate) && (
            <div className="mb-4 px-4">
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="text-sm"
              >
                Clear Filters
              </Button>
            </div>
          )}

          {tableRef.current?.table && (
            <DataTableFilter
              searchTerm={searchTerm}
              handleFilterChange={handleFilterChange}
              table={tableRef.current.table}
              searchPlaceholder="Search payments..."
              columnVisibility={columnVisibility}
              customColumnNames={{
                invoice: "Transaction Number",
              }}
            />
          )}

          {(statusFilter || paymentMethodFilter) && (
            <div className="mb-3 px-4">
              <span className="text-muted-foreground text-sm">
                Showing {filteredPayments.length} of {allPayments.length}{" "}
                payments
                {(statusFilter || paymentMethodFilter) &&
                  ` filtered by:${
                    statusFilter ? ` Status: ${statusFilter}` : ""
                  }${
                    paymentMethodFilter
                      ? ` Payment Method: ${paymentMethodFilter}`
                      : ""
                  }`}
              </span>
            </div>
          )}

          <DataTable
            data={data}
            columns={columns}
            isLoading={isLoading}
            page={page}
            limit={limit}
            total={
              statusFilter || paymentMethodFilter
                ? filteredPayments.length
                : total
            }
            onPageChange={setPage}
            onLimitChange={setLimit}
            actions={actions}
            ref={tableRef}
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
          />
        </div>
      </div>
    </section>
  );
}
