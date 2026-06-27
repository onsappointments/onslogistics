export default function CoverPage() {
  return (
    <section
      className="
      w-[794px]
      h-[1123px]
      bg-white
      relative
      mx-auto
      "
    >
      {/* Hero Image */}

      <img
        src="/brochure/factory.jpg"
        className="
        absolute
        right-0
        top-0
        h-full
        w-[320px]
        object-cover
        "
      />

      {/* Logo */}

      <img
        src="/logo.png"
        className="w-48 mt-12 ml-12"
      />

      {/* Title */}

      <div className="mt-24 ml-12">
        <h1 className="text-5xl font-bold text-blue-600">
          Unlock Import Duty Savings
        </h1>

        <h2 className="text-3xl mt-6">
          Manufacturing & Other Operations
          under Warehouse Regulations
        </h2>
      </div>
    </section>
  );
}