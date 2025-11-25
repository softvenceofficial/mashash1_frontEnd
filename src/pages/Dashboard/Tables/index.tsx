import TableDemo1 from "./components/TableDemo1";
import TableDemo2 from "./components/TableDemo2";
import TableDemo3 from "./components/TableDemo3";

export default function TablesPage() {
  return (
    <section className="space-y-10">
      <h3 className="text-2xl font-semibold">Tables</h3>
      <hr className="my-10" />

      {/* Basic Table  */}
      <TableDemo1 />

      <hr className="my-10" />

      {/* Table with Fixed Actionss Column */}
      <TableDemo2 />

      {/* Table With Style Customization */}
      <TableDemo3 />
    </section>
  );
}
