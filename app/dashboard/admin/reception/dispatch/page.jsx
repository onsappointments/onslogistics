"use client";

import { useEffect, useState } from "react";
import AddReceivalModal from "@/Components/dispatch/AddReceivalModal";
import AddDispatchModal from "@/Components/dispatch/AddDispatchModal";
import { Search, Filter, Plus, Edit2, Trash2, Calendar, ArrowUpDown, X, Package, Mail, User, MapPin, FileText, Truck, MessageSquare, Hash } from "lucide-react";

// Detail View Modal Component
function DetailViewModal({ isOpen, onClose, data, type }) {
  if (!isOpen || !data) return null;

  const isReceival = type === "receival";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              {isReceival ? "Receival Details" : "Dispatch Details"}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Serial No: <span className="font-semibold text-blue-600">#{data.serialNo}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-180px)]">
          <div className="space-y-6">
            {/* Date */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Date
                </p>
                <p className="text-gray-900 font-medium">
                  {new Date(data.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            {isReceival ? (
              <>
                {/* Letter No */}
                {data.letterNo && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <Hash className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                        Letter Number
                      </p>
                      <p className="text-gray-900 font-medium">{data.letterNo}</p>
                    </div>
                  </div>
                )}

                {/* From Who */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      From
                    </p>
                    <p className="text-gray-900 font-medium">{data.fromWho}</p>
                  </div>
                </div>

                {/* Receiver */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Received By
                    </p>
                    <p className="text-gray-900 font-medium">{data.receiver}</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Name */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Recipient Name
                    </p>
                    <p className="text-gray-900 font-medium">{data.name}</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Address
                    </p>
                    <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">{data.address}</p>
                  </div>
                </div>

                {/* Place */}
                {data.place && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-teal-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                        Place
                      </p>
                      <p className="text-gray-900 font-medium">{data.place}</p>
                    </div>
                  </div>
                )}

                {/* Dock No */}
                {data.dockNo && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <Package className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                        Dock Number
                      </p>
                      <p className="text-gray-900 font-medium">{data.dockNo}</p>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Courier Service */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <Truck className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Courier Service
                </p>
                <span className="inline-block px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold">
                  {data.courierService}
                </span>
              </div>
            </div>

            {/* Subject */}
            {data.subject && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Subject
                  </p>
                  <p className="text-gray-900 whitespace-pre-wrap leading-relaxed bg-gray-50 p-4 rounded-lg">
                    {data.subject}
                  </p>
                </div>
              </div>
            )}

            {/* Remarks */}
            {data.remarks && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-5 h-5 text-pink-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Remarks
                  </p>
                  <p className="text-gray-900 whitespace-pre-wrap leading-relaxed bg-gray-50 p-4 rounded-lg">
                    {data.remarks}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DispatchPage() {
  const [activeView, setActiveView] = useState("receival");
  const [receivalData, setReceivalData] = useState([]);
  const [dispatchData, setDispatchData] = useState([]);
  const [openReceival, setOpenReceival] = useState(false);
  const [openDispatch, setOpenDispatch] = useState(false);
  const [serialSort, setSerialSort] = useState("asc");
  const [editingReceival, setEditingReceival] = useState(null);
  const [editingDispatch, setEditingDispatch] = useState(null);

  // Detail view
  const [viewingDetail, setViewingDetail] = useState(null);
  const [detailType, setDetailType] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [courierServiceFilter, setCourierServiceFilter] = useState("all");

  /* ---------- FETCH FUNCTIONS ---------- */

  const fetchReceival = async () => {
    const res = await fetch("/api/admin/couriers/receival");
    if (res.ok) {
      const data = await res.json();
      setReceivalData(data);
    }
  };

  const fetchDispatch = async () => {
    const res = await fetch("/api/admin/couriers/dispatch");
    if (res.ok) {
      const data = await res.json();
      setDispatchData(data);
    }
  };

  const sortBySerial = (data) => {
    return [...data].sort((a, b) =>
      serialSort === "asc" ? a.serialNo - b.serialNo : b.serialNo - a.serialNo
    );
  };

  const filterData = (data) => {
    return data.filter((item) => {
      const searchMatch =
        !searchTerm ||
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        );

      const dateMatch =
        (!dateFrom || new Date(item.date) >= new Date(dateFrom)) &&
        (!dateTo || new Date(item.date) <= new Date(dateTo));

      const courierMatch =
        courierServiceFilter === "all" ||
        item.courierService === courierServiceFilter;

      return searchMatch && dateMatch && courierMatch;
    });
  };

  const openEditReceival = (row, e) => {
    e.stopPropagation(); // Prevent row click
    setEditingReceival(row);
    setOpenReceival(true);
  };

  const openEditDispatch = (row, e) => {
    e.stopPropagation(); // Prevent row click
    setEditingDispatch(row);
    setOpenDispatch(true);
  };

  const deleteReceival = async (id, e) => {
    e.stopPropagation(); // Prevent row click
    if (!confirm("Delete this receival entry?")) return;

    await fetch("/api/admin/couriers/receival", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    fetchReceival();
  };

  const deleteDispatch = async (id, e) => {
    e.stopPropagation(); // Prevent row click
    if (!confirm("Delete this dispatch entry?")) return;

    await fetch("/api/admin/couriers/dispatch", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    fetchDispatch();
  };

  const openDetailView = (data, type) => {
    setViewingDetail(data);
    setDetailType(type);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDateFrom("");
    setDateTo("");
    setCourierServiceFilter("all");
  };

  const getUniqueCourierServices = () => {
    const data = activeView === "receival" ? receivalData : dispatchData;
    return [...new Set(data.map((item) => item.courierService))].sort();
  };

  useEffect(() => {
    if (activeView === "receival") {
      fetchReceival();
    } else {
      fetchDispatch();
    }
  }, [activeView]);

  const currentData = activeView === "receival" ? receivalData : dispatchData;
  const filteredData = filterData(currentData);
  const sortedData = sortBySerial(filteredData);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Courier Register</h1>
            <p className="text-gray-500 mt-1">Manage receival and dispatch records</p>
          </div>

          {activeView === "receival" ? (
            <button
              onClick={() => setOpenReceival(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
            >
              <Plus className="w-5 h-5" />
              Add Receival
            </button>
          ) : (
            <button
              onClick={() => setOpenDispatch(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
            >
              <Plus className="w-5 h-5" />
              Add Dispatch
            </button>
          )}
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Toggle Tabs */}
          <div className="border-b border-gray-200 bg-gray-50 px-6">
            <div className="flex gap-1">
              <button
                onClick={() => setActiveView("receival")}
                className={`px-6 py-3 font-semibold text-sm transition-all relative ${
                  activeView === "receival"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Receival
                <span
                  className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    activeView === "receival"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {receivalData.length}
                </span>
              </button>
              <button
                onClick={() => setActiveView("dispatch")}
                className={`px-6 py-3 font-semibold text-sm transition-all relative ${
                  activeView === "dispatch"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Dispatch
                <span
                  className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    activeView === "dispatch"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {dispatchData.length}
                </span>
              </button>
            </div>
          </div>

          {/* Filters Section */}
          <div className="bg-gray-50 border-b border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search all fields..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              {/* Date From */}
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              {/* Date To */}
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              {/* Courier Service Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={courierServiceFilter}
                  onChange={(e) => setCourierServiceFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="all">All Courier Services</option>
                  {getUniqueCourierServices().map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filter Actions */}
            {(searchTerm || dateFrom || dateTo || courierServiceFilter !== "all") && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {sortedData.length} of {currentData.length} entries
                </p>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            {activeView === "receival" ? (
              sortedData.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">No receival entries found</p>
                  <p className="text-gray-400 text-sm mt-1">
                    {searchTerm || dateFrom || dateTo || courierServiceFilter !== "all"
                      ? "Try adjusting your filters"
                      : "Click 'Add Receival' to create your first entry"}
                  </p>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th
                        onClick={() => setSerialSort(serialSort === "asc" ? "desc" : "asc")}
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          No.
                          <ArrowUpDown className="w-4 h-4" />
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Letter No.
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        From
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Courier Service
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Receiver
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {sortedData.map((r, index) => (
                      <tr
                        key={r._id}
                        onClick={() => openDetailView(r, "receival")}
                        className={`${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } hover:bg-blue-50 transition-colors cursor-pointer`}
                      >
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                          {r.serialNo}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {new Date(r.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {r.letterNo || "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                          {r.fromWho}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                          <div className="line-clamp-2">
                            {r.subject || "-"}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium">
                            {r.courierService}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{r.receiver}</td>
                        <td className="px-6 py-4 text-sm text-center" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={(e) => openEditReceival(r, e)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => deleteReceival(r._id, e)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            ) : sortedData.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">No dispatch entries found</p>
                <p className="text-gray-400 text-sm mt-1">
                  {searchTerm || dateFrom || dateTo || courierServiceFilter !== "all"
                    ? "Try adjusting your filters"
                    : "Click 'Add Dispatch' to create your first entry"}
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th
                      onClick={() => setSerialSort(serialSort === "asc" ? "desc" : "asc")}
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        No.
                        <ArrowUpDown className="w-4 h-4" />
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Place
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Courier Service
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sortedData.map((d, index) => (
                    <tr
                      key={d._id}
                      onClick={() => openDetailView(d, "dispatch")}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-blue-50 transition-colors cursor-pointer`}
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {d.serialNo}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {new Date(d.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                        {d.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                        <div className="line-clamp-2">
                          {d.address}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{d.place}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                        <div className="line-clamp-2">
                          {d.subject || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium">
                          {d.courierService}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={(e) => openEditDispatch(d, e)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => deleteDispatch(d._id, e)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* MODALS */}
      <AddReceivalModal
        open={openReceival}
        initialData={editingReceival}
        onClose={() => {
          setOpenReceival(false);
          setEditingReceival(null);
        }}
        onSuccess={fetchReceival}
      />

      <AddDispatchModal
        open={openDispatch}
        initialData={editingDispatch}
        onClose={() => {
          setOpenDispatch(false);
          setEditingDispatch(null);
        }}
        onSuccess={fetchDispatch}
      />

      {/* Detail View Modal */}
      <DetailViewModal
        isOpen={!!viewingDetail}
        onClose={() => setViewingDetail(null)}
        data={viewingDetail}
        type={detailType}
      />

      {/* CSS */}
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          word-break: break-word;
        }
      `}</style>
    </div>
  );
}