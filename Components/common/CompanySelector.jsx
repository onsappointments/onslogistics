"use client";

import { useEffect, useState } from "react";

export default function CompanySelector({
  companies = [],
  value = "",
  onSelect,
  onCreateCompany,
  placeholder = "Search Company...",
}) {
  const [query, setQuery] = useState(value);
  const [filteredCompanies, setFilteredCompanies] = useState([]);

  useEffect(() => {
    setQuery(value);
   }, [value]);

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        placeholder={placeholder}
        className="input-box"
       onChange={(e) => {
  const value = e.target.value;

  setQuery(value);

  // If input is empty, clear everything
  if (!value.trim()) {
    setFilteredCompanies([]);

    onSelect?.({
      name: "",
      gstin: "",
      state: "",
    });

    return;
  }

  const search = value.toLowerCase();

  const filtered = companies
    .filter((company) => {
      return (
        company.name?.toLowerCase().includes(search) ||
        company.gstin?.toLowerCase().includes(search) ||
        company.state?.toLowerCase().includes(search)
      );
    })
    .slice(0, 10);

  setFilteredCompanies(filtered);
}}
      />

      {filteredCompanies.length > 0 && (
  <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-72 overflow-y-auto">
    {filteredCompanies.map((company, index) => (
      <button
        key={company.gstin || company.name}
        type="button"
        className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b last:border-b-0"
        onClick={() => {
          setQuery(company.name);
          setFilteredCompanies([]);
          onSelect?.(company);
        }}
      >
        <div className="font-medium text-gray-900">
          {company.name}
        </div>

        <div className="text-xs text-gray-500 mt-1 flex gap-4">
          <span>
            GST : {company.gstin || "—"}
          </span>

          <span>
            {company.state || "No State"}
          </span>

          
        </div>
      </button>

    ))}
    <button
            type="button"
            className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-blue-50 border-t font-medium text-blue-600"
            onClick={() => {
  console.log("Create Company Clicked");

  onCreateCompany?.({
    name: query.trim(),
  });
}}
        >
            ➕ Create New Company
        </button>
  </div>
)}
    </div>
  );
}