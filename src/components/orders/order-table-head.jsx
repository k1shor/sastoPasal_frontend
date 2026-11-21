export function OrderTableHead() {
  return (
    <thead>
      <tr className="bg-primary/10 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        <th scope="col" className="px-2 py-3.5 text-left whitespace-nowrap sm:px-4">
          Order ID
        </th>
        <th scope="col" className="px-2 py-3.5 text-left sm:px-4">
          Product
        </th>
        <th scope="col" className="hidden px-4 py-3.5 text-left md:table-cell">
          Customer
        </th>
        <th scope="col" className="hidden px-4 py-3.5 text-left lg:table-cell">
          Units
        </th>
        <th scope="col" className="px-2 py-3.5 text-right sm:px-4">
          Total
        </th>
        <th scope="col" className="hidden px-4 py-3.5 text-left xl:table-cell">
          Payment
        </th>
        <th scope="col" className="px-2 py-3.5 text-right sm:px-4">
          Status
        </th>
      </tr>
    </thead>
  );
}
