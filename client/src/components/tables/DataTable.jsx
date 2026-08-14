import Loader from "../common/Loader";
import EmptyState from "../common/EmptyState";

function DataTable({
  columns,

  data,

  loading,

  emptyTitle = "No Data Found",

  rowClassName,
}) {
  if (loading) {
    return <Loader />;
  }

  if (!data.length) {
    return <EmptyState title={emptyTitle} />;
  }

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-slate-50/90 text-slate-600">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="whitespace-nowrap border-b border-slate-200 px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em]"
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((row, rowIndex) => (
              <tr
                key={row.id}
                className={`transition hover:bg-slate-50 ${rowClassName ? rowClassName(row) : ""} ${rowIndex !== data.length - 1 ? "border-b border-slate-100" : ""}`}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="whitespace-nowrap px-5 py-4 text-sm text-slate-700"
                  >
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;
