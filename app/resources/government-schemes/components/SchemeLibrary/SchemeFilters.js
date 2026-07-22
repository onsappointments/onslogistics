export default function SchemeFilters({
  filters,
  activeFilter,
  onChange,
}) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {filters.map((filter) => {
        const active = activeFilter === filter;

        return (
          <button
            key={filter}
            type="button"
            onClick={() => onChange(filter)}
            className={`
              rounded-full
              border
              px-5
              py-2.5
              text-sm
              font-semibold
              transition-all
              duration-200
              ${
                active
                  ? "border-blue-600 bg-blue-600 text-white shadow-md"
                  : "border-gray-200 bg-white text-gray-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              }
            `}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
}