"use client";

import { useEffect, useState } from "react";
import AddReceivalModal from "@/Components/dispatch/AddReceivalModal";
import AddDispatchModal from "@/Components/dispatch/AddDispatchModal";
import { Search, Filter, Plus, Edit2, Trash2, Calendar, ArrowUpDown, X, Package, Mail, User, MapPin, FileText, Truck, MessageSquare, Hash, Eye, Clock } from "lucide-react";

// Detail View Modal Component
function DetailViewModal({ isOpen, onClose, data, type }) {
  if (!isOpen || !data) return null;

  const isReceival = type === "receival";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-br from-blue-500 to-indigo-600">
          <div>
            <h3 className="text-2xl font-bold text-white">
              {isReceival ? "Receival Details" : "Dispatch Details"}
            </h3>
            <p className="text-sm text-blue-100 mt-1">
              Serial No: <span className="font-semibold">#{data.serialNo}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                  Date
                </p>
              </div>
              <p className="text-gray-900 font-semibold text-sm ml-13">
                {new Date(data.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
            </div>

            {isReceival ? (
              <>
                {/* Letter No */}
                {data.letterNo && (
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center flex-shrink-0">
                        <Hash className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                        Letter Number
                      </p>
                    </div>
                    <p className="text-gray-900 font-semibold text-sm ml-13">{data.letterNo}</p>
                  </div>
                )}

                {/* From Who */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-xs font-bold text-green-700 uppercase tracking-wider">
                      From
                    </p>
                  </div>
                  <p className="text-gray-900 font-semibold text-sm ml-13">{data.fromWho}</p>
                </div>

                {/* Receiver */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-xs font-bold text-orange-700 uppercase tracking-wider">
                      Received By
                    </p>
                  </div>
                  <p className="text-gray-900 font-semibold text-sm ml-13">{data.receiver}</p>
                </div>
              </>
            ) : (
              <>
                {/* Name */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-xs font-bold text-green-700 uppercase tracking-wider">
                      Recipient
                    </p>
                  </div>
                  <p className="text-gray-900 font-semibold text-sm ml-13">{data.name}</p>
                </div>

                {/* Place */}
                {data.place && (
                  <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-4 rounded-xl border border-teal-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-teal-500 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                        Place
                      </p>
                    </div>
                    <p className="text-gray-900 font-semibold text-sm ml-13">{data.place}</p>
                  </div>
                )}

                {/* Handover By */}
                {data.handoverby && (
                  <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-4 rounded-xl border border-cyan-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-cyan-500 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-xs font-bold text-cyan-700 uppercase tracking-wider">
                        Handover By
                      </p>
                    </div>
                    <p className="text-gray-900 font-semibold text-sm ml-13">{data.handoverby}</p>
                  </div>
                )}

                {/* Handover To */}
                {data.handoverto && (
                  <div className="bg-gradient-to-br from-lime-50 to-lime-100 p-4 rounded-xl border border-lime-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-lime-500 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-xs font-bold text-lime-700 uppercase tracking-wider">
                        Handover To
                      </p>
                    </div>
                    <p className="text-gray-900 font-semibold text-sm ml-13">{data.handoverto}</p>
                  </div>
                )}

                {/* Status */}
                {data.status && (
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-xl border border-emerald-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
                        <Package className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                        Status
                      </p>
                    </div>
                    <p className="text-gray-900 font-semibold text-sm ml-13">{data.status}</p>
                  </div>
                )}

                {/* Delivered Date */}
                {data.delivereddate && (
                  <div className="bg-gradient-to-br from-violet-50 to-violet-100 p-4 rounded-xl border border-violet-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-violet-500 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-xs font-bold text-violet-700 uppercase tracking-wider">
                        Delivered
                      </p>
                    </div>
                    <p className="text-gray-900 font-semibold text-sm ml-13">{data.delivereddate}</p>
                  </div>
                )}
              </>
            )}

            {/* Courier Service - Full Width */}
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-xl border border-indigo-200 md:col-span-2">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center flex-shrink-0">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <p className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                  Courier Service
                </p>
              </div>
              <span className="inline-block px-4 py-2 bg-white text-indigo-700 rounded-lg text-sm font-bold ml-13 shadow-sm">
                {data.courierService}
              </span>
            </div>
          </div>

          {/* Address - Full Width */}
          {!isReceival && data.address && (
            <div className="mt-4 bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <p className="text-xs font-bold text-red-700 uppercase tracking-wider">
                  Address
                </p>
              </div>
              <p className="text-gray-900 leading-relaxed bg-white p-3 rounded-lg ml-13 text-sm">{data.address}</p>
            </div>
          )}

          {/* Subject - Full Width */}
          {data.subject && (
            <div className="mt-4 bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl border border-yellow-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-500 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <p className="text-xs font-bold text-yellow-700 uppercase tracking-wider">
                  Subject
                </p>
              </div>
              <p className="text-gray-900 whitespace-pre-wrap leading-relaxed bg-white p-3 rounded-lg ml-13 text-sm">
                {data.subject}
              </p>
            </div>
          )}

          {/* Remarks - Full Width */}
          {data.remarks && (
            <div className="mt-4 bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-xl border border-pink-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-pink-500 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <p className="text-xs font-bold text-pink-700 uppercase tracking-wider">
                  Remarks
                </p>
              </div>
              <p className="text-gray-900 whitespace-pre-wrap leading-relaxed bg-white p-3 rounded-lg ml-13 text-sm">
                {data.remarks}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all font-medium shadow-sm"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="w-full max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Courier Register
            </h1>
            <p className="text-gray-600 text-base">Track and manage all courier activities</p>
          </div>

          {activeView === "receival" ? (
            <button
              onClick={() => setOpenReceival(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              Add Receival
            </button>
          ) : (
            <button
              onClick={() => setOpenDispatch(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              Add Dispatch
            </button>
          )}
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Toggle Tabs */}
          <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 px-6">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveView("receival")}
                className={`px-6 py-4 font-bold text-sm transition-all relative ${
                  activeView === "receival"
                    ? "text-blue-600 bg-white rounded-t-xl shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-t-xl"
                }`}
              >
                Receival
                <span
                  className={`ml-2 px-2.5 py-1 rounded-full text-xs font-bold ${
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
                className={`px-6 py-4 font-bold text-sm transition-all relative ${
                  activeView === "dispatch"
                    ? "text-blue-600 bg-white rounded-t-xl shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-t-xl"
                }`}
              >
                Dispatch
                <span
                  className={`ml-2 px-2.5 py-1 rounded-full text-xs font-bold ${
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
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search all fields..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                />
              </div>

              {/* Date From */}
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                />
              </div>

              {/* Date To */}
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                />
              </div>

              {/* Courier Service Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={courierServiceFilter}
                  onChange={(e) => setCourierServiceFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer shadow-sm"
                >
                  <option value="all">All Courier Services</option>
                  {getUniqueCourierServices().map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Order Toggle */}
              <button
                onClick={() => setSerialSort(serialSort === "asc" ? "desc" : "asc")}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-blue-400 transition-all shadow-sm font-medium text-gray-700"
                title={`Sort: ${serialSort === "asc" ? "Ascending" : "Descending"}`}
              >
                <ArrowUpDown className="w-5 h-5 text-gray-600" />
                <span className="text-sm">
                  {serialSort === "asc" ? "Newest First" : "Oldest First"}
                </span>
              </button>
            </div>

            {/* Filter Actions */}
            {(searchTerm || dateFrom || dateTo || courierServiceFilter !== "all") && (
              <div className="mt-4 flex items-center justify-between bg-white p-4 rounded-xl shadow-sm">
                <p className="text-sm text-gray-600 font-medium">
                  Showing <span className="text-blue-600 font-bold">{sortedData.length}</span> of <span className="font-bold">{currentData.length}</span> entries
                </p>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            {activeView === "receival" ? (
              sortedData.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-10 h-10 text-blue-500" />
                  </div>
                  <p className="text-gray-700 font-semibold text-lg">No receival entries found</p>
                  <p className="text-gray-500 text-sm mt-2">
                    {searchTerm || dateFrom || dateTo || courierServiceFilter !== "all"
                      ? "Try adjusting your filters"
                      : "Click 'Add Receival' to create your first entry"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedData.map((r, index) => (
                    <div
                      key={r._id}
                      onClick={() => openDetailView(r, "receival")}
                      className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-400 hover:shadow-xl transition-all cursor-pointer group"
                    >
                      {/* Header Section */}
                      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
                            #{r.serialNo}
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Receival Date</p>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-blue-600" />
                              <p className="text-base font-bold text-gray-900">
                                {new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={(e) => openEditReceival(r, e)}
                            className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors border border-blue-200"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => deleteReceival(r._id, e)}
                            className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-red-200"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Main Info Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Mail className="w-4 h-4 text-green-600" />
                            <p className="text-xs text-green-700 font-bold uppercase tracking-wider">From</p>
                          </div>
                          <p className="text-sm font-bold text-gray-900">{r.fromWho}</p>
                        </div>

                        {r.letterNo && (
                          <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-4 rounded-xl border border-purple-200">
                            <div className="flex items-center gap-2 mb-2">
                              <Hash className="w-4 h-4 text-purple-600" />
                              <p className="text-xs text-purple-700 font-bold uppercase tracking-wider">Letter No.</p>
                            </div>
                            <p className="text-sm font-bold text-gray-900">{r.letterNo}</p>
                          </div>
                        )}

                        <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-xl border border-orange-200">
                          <div className="flex items-center gap-2 mb-2">
                            <User className="w-4 h-4 text-orange-600" />
                            <p className="text-xs text-orange-700 font-bold uppercase tracking-wider">Receiver</p>
                          </div>
                          <p className="text-sm font-bold text-gray-900">{r.receiver}</p>
                        </div>
                      </div>

                      {/* Secondary Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Truck className="w-4 h-4 text-blue-600" />
                            <p className="text-xs text-blue-700 font-bold uppercase tracking-wider">Courier Service</p>
                          </div>
                          <p className="text-sm font-bold text-blue-900">{r.courierService}</p>
                        </div>

                        {r.subject && (
                          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-4 rounded-xl border border-yellow-200">
                            <div className="flex items-center gap-2 mb-2">
                              <FileText className="w-4 h-4 text-yellow-600" />
                              <p className="text-xs text-yellow-700 font-bold uppercase tracking-wider">Subject</p>
                            </div>
                            <p className="text-sm text-gray-700 line-clamp-2">{r.subject}</p>
                          </div>
                        )}
                      </div>

                      {/* Remarks if present */}
                      {r.remarks && (
                        <div className="mt-4 bg-gradient-to-br from-pink-50 to-rose-50 p-4 rounded-xl border border-pink-200">
                          <div className="flex items-center gap-2 mb-2">
                            <MessageSquare className="w-4 h-4 text-pink-600" />
                            <p className="text-xs text-pink-700 font-bold uppercase tracking-wider">Remarks</p>
                          </div>
                          <p className="text-sm text-gray-700 line-clamp-2">{r.remarks}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )
            ) : sortedData.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-blue-500" />
                </div>
                <p className="text-gray-700 font-semibold text-lg">No dispatch entries found</p>
                <p className="text-gray-500 text-sm mt-2">
                  {searchTerm || dateFrom || dateTo || courierServiceFilter !== "all"
                    ? "Try adjusting your filters"
                    : "Click 'Add Dispatch' to create your first entry"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedData.map((d, index) => (
                  <div
                    key={d._id}
                    onClick={() => openDetailView(d, "dispatch")}
                    className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-400 hover:shadow-xl transition-all cursor-pointer group"
                  >
                    {/* Header Section */}
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
                          #{d.serialNo}
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Dispatch Date</p>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            <p className="text-base font-bold text-gray-900">
                              {new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => openEditDispatch(d, e)}
                          className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors border border-blue-200"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => deleteDispatch(d._id, e)}
                          className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-red-200"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Main Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="w-4 h-4 text-green-600" />
                          <p className="text-xs text-green-700 font-bold uppercase tracking-wider">Recipient</p>
                        </div>
                        <p className="text-sm font-bold text-gray-900">{d.name}</p>
                      </div>

                      <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-4 rounded-xl border border-teal-200">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="w-4 h-4 text-teal-600" />
                          <p className="text-xs text-teal-700 font-bold uppercase tracking-wider">Place</p>
                        </div>
                        <p className="text-sm font-bold text-gray-900">{d.place}</p>
                      </div>

                      <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Package className="w-4 h-4 text-amber-600" />
                          <p className="text-xs text-amber-700 font-bold uppercase tracking-wider">Status</p>
                        </div>
                        <p className="text-sm font-bold text-amber-900">{d.status}</p>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="mb-4 bg-gradient-to-br from-red-50 to-pink-50 p-4 rounded-xl border border-red-200">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-red-600" />
                        <p className="text-xs text-red-700 font-bold uppercase tracking-wider">Address</p>
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-2">{d.address}</p>
                    </div>

                    {/* Secondary Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Truck className="w-4 h-4 text-blue-600" />
                          <p className="text-xs text-blue-700 font-bold uppercase tracking-wider">Courier Service</p>
                        </div>
                        <p className="text-sm font-bold text-blue-900">{d.courierService}</p>
                      </div>

                      {d.subject && (
                        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-4 rounded-xl border border-yellow-200">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="w-4 h-4 text-yellow-600" />
                            <p className="text-xs text-yellow-700 font-bold uppercase tracking-wider">Subject</p>
                          </div>
                          <p className="text-sm text-gray-700 line-clamp-2">{d.subject}</p>
                        </div>
                      )}
                    </div>

                    {/* Handover Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {d.handoverby && (
                        <div className="bg-gradient-to-br from-lime-50 to-green-50 p-4 rounded-xl border border-lime-200">
                          <div className="flex items-center gap-2 mb-2">
                            <User className="w-4 h-4 text-lime-600" />
                            <p className="text-xs text-lime-700 font-bold uppercase tracking-wider">Handover By</p>
                          </div>
                          <p className="text-sm font-bold text-gray-900">{d.handoverby}</p>
                        </div>
                      )}

                      {d.handoverto && (
                        <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-4 rounded-xl border border-purple-200">
                          <div className="flex items-center gap-2 mb-2">
                            <User className="w-4 h-4 text-purple-600" />
                            <p className="text-xs text-purple-700 font-bold uppercase tracking-wider">Handover To</p>
                          </div>
                          <p className="text-sm font-bold text-gray-900">{d.handoverto}</p>
                        </div>
                      )}

                      {d.delivereddate && (
                        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-xl border border-indigo-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-4 h-4 text-indigo-600" />
                            <p className="text-xs text-indigo-700 font-bold uppercase tracking-wider">Delivered</p>
                          </div>
                          <p className="text-sm font-bold text-gray-900">{d.delivereddate}</p>
                        </div>
                      )}
                    </div>

                    {/* Remarks if present */}
                    {d.remarks && (
                      <div className="mt-4 bg-gradient-to-br from-pink-50 to-rose-50 p-4 rounded-xl border border-pink-200">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare className="w-4 h-4 text-pink-600" />
                          <p className="text-xs text-pink-700 font-bold uppercase tracking-wider">Remarks</p>
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-2">{d.remarks}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
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