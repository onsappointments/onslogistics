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

                {/* Handover By */}
                {data.handoverby && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-cyan-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                        Handover By
                      </p>
                      <p className="text-gray-900 font-medium">{data.handoverby}</p>
                    </div>
                  </div>
                )}

                {/* Handover To */}
                {data.handoverto && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-lime-100 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-lime-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                        Handover To
                      </p>
                      <p className="text-gray-900 font-medium">{data.handoverto}</p>
                    </div>
                  </div>
                )}

                {/* Status */}
                {data.status && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <Package className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                        Status
                      </p>
                      <p className="text-gray-900 font-medium">{data.status}</p>
                    </div>
                  </div>
                )}

                {/* Delivered Date */}
                {data.delivereddate && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-violet-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                        Delivered Date
                      </p>
                      <p className="text-gray-900 font-medium">{data.delivereddate}</p>
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
    e.stopPropagation();
    setEditingReceival(row);
    setOpenReceival(true);
  };

  const openEditDispatch = (row, e) => {
    e.stopPropagation();
    setEditingDispatch(row);
    setOpenDispatch(true);
  };

  const deleteReceival = async (id, e) => {
    e.stopPropagation();
    if (!confirm("Delete this receival entry?")) return;

    await fetch("/api/admin/couriers/receival", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    fetchReceival();
  };

  const deleteDispatch = async (id, e) => {
    e.stopPropagation();
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
    <div className="min-h-screen bg-gray-50 p-6 overflow-x-hidden">
      <div className="w-full max-w-[1600px] mx-auto overflow-visible">
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 w-full overflow-hidden">
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

          {/* Table Container - Horizontal Scroll Area */}
          <div className="relative w-full">
            <div className="overflow-x-auto overflow-y-hidden" style={{ maxWidth: '100%' }}>
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden">
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
                    <div className="max-h-[600px] overflow-y-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0 z-10">
                          <tr>
                            <th
                              onClick={() => setSerialSort(serialSort === "asc" ? "desc" : "asc")}
                              className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors whitespace-nowrap"
                            >
                              <div className="flex items-center gap-2">
                                No.
                                <ArrowUpDown className="w-4 h-4" />
                              </div>
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                              Date
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                              Letter No.
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                              From
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                              Subject
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                              Courier Service
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                              Receiver
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {sortedData.map((r, index) => (
                            <tr
                              key={r._id}
                              onClick={() => openDetailView(r, "receival")}
                              className={`${
                                index % 2 === 0 ? "bg-white" : "bg-gray-50"
                              } hover:bg-blue-50 transition-colors cursor-pointer`}
                            >
                              <td className="px-6 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">
                                {r.serialNo}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                                {new Date(r.date).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                                {r.letterNo || "-"}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-700 font-medium whitespace-nowrap">
                                {r.fromWho}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                                <div className="line-clamp-2">
                                  {r.subject || "-"}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm whitespace-nowrap">
                                <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium">
                                  {r.courierService}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{r.receiver}</td>
                              <td className="px-6 py-4 text-sm text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
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
                    </div>
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
                  <div className="max-h-[600px] overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200" style={{ minWidth: '1400px' }}>
                      <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                          <th
                            onClick={() => setSerialSort(serialSort === "asc" ? "desc" : "asc")}
                            className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors whitespace-nowrap"
                          >
                            <div className="flex items-center gap-2">
                              No.
                              <ArrowUpDown className="w-4 h-4" />
                            </div>
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                            Date
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                            Name
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                            Address
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                            Place
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                            Subject
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                            Courier Service
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                            Handover By
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                            Handover To
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                            Status
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                            Delivered Date
                          </th>
                          <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {sortedData.map((d, index) => (
                          <tr
                            key={d._id}
                            onClick={() => openDetailView(d, "dispatch")}
                            className={`${
                              index % 2 === 0 ? "bg-white" : "bg-gray-50"
                            } hover:bg-blue-50 transition-colors cursor-pointer`}
                          >
                            <td className="px-6 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">
                              {d.serialNo}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                              {new Date(d.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700 font-medium whitespace-nowrap">
                              {d.name}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                              <div className="line-clamp-2">
                                {d.address}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{d.place}</td>
                            <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                              <div className="line-clamp-2">
                                {d.subject || "-"}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm whitespace-nowrap">
                              <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium">
                                {d.courierService}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm whitespace-nowrap">
                              <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium">
                                {d.handoverby}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm whitespace-nowrap">
                              <span className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded-md text-xs font-medium">
                                {d.handoverto}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm whitespace-nowrap">
                              <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-md text-xs font-medium">
                                {d.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                              {d.delivereddate || "-"}
                            </td>
                            <td className="px-6 py-4 text-sm text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
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
                  </div>
                )}
              </div>
            </div>
            </div>
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
        
        /* Make horizontal scrollbar visible and styled */
        .overflow-x-auto {
          scrollbar-width: thin;
          scrollbar-color: #9ca3af #f3f4f6;
        }
        
        .overflow-x-auto::-webkit-scrollbar {
          height: 12px;
        }
        
        .overflow-x-auto::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 0;
        }
        
        .overflow-x-auto::-webkit-scrollbar-thumb {
          background-color: #9ca3af;
          border-radius: 6px;
          border: 2px solid #f3f4f6;
        }
        
        .overflow-x-auto::-webkit-scrollbar-thumb:hover {
          background-color: #6b7280;
        }
      `}</style>
    </div>
  );
}