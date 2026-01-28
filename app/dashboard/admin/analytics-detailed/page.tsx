"use client";

import { useState, useEffect } from "react";
import {
  Download,
  Filter,
  Search,
  Calendar,
  TrendingUp,
  Users,
  FileText,
  Package,
  DollarSign,
  X,
  ChevronDown,
  ArrowUpDown,
  Eye,
} from "lucide-react";

interface DetailedAnalyticsData {
  jobsList: Array<{
    _id: string;
    jobNumber: string;
    jobId: string;
    company: string;
    status: string;
    source: string;
    shipmentType: string;
    createdAt: string;
    completedAt?: string;
    revenue?: number;
  }>;
  quotesList: Array<{
    _id: string;
    referenceNo: string;
    company: string;
    email: string;
    status: string;
    shipmentType: string;
    fromCountry: string;
    toCountry: string;
    createdAt: string;
    hasLinkedJob: boolean;
  }>;
  clientActivity: Array<{
    clientName: string;
    company: string;
    totalJobs: number;
    completedJobs: number;
    totalRevenue: number;
    quotesRequested: number;
    quotesApproved: number;
    lastActivity: string;
  }>;
  adminPerformance: Array<{
    adminName: string;
    role: string;
    totalActions: number;
    jobsHandled: number;
    quotesProcessed: number;
    avgResponseTime: number;
  }>;
  recentAuditLogs: Array<{
    _id: string;
    action: string;
    entityType: string;
    entityId: string;
    description: string;
    performedBy: string;
    performedByRole: string;
    createdAt: string;
  }>;
}

export default function DetailedAnalytics() {
  const [data, setData] = useState<DetailedAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "jobs" | "quotes" | "clients" | "admins" | "audit"
  >("jobs");

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [shipmentTypeFilter, setShipmentTypeFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    fetchDetailedAnalytics();
  }, []);

  const fetchDetailedAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/analytics/detailed");
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching detailed analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = (dataToExport: any[], filename: string) => {
    if (!dataToExport.length) return;

    const headers = Object.keys(dataToExport[0]);
    const csv = [
      headers.join(","),
      ...dataToExport.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            return typeof value === "string" && value.includes(",")
              ? `"${value}"`
              : value;
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const filterData = (items: any[]) => {
    return items.filter((item) => {
      const searchMatch =
        !searchTerm ||
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        );

      const statusMatch =
        statusFilter === "all" || item.status === statusFilter;

      const dateMatch =
        (!dateFrom || new Date(item.createdAt) >= new Date(dateFrom)) &&
        (!dateTo || new Date(item.createdAt) <= new Date(dateTo));

      const shipmentMatch =
        shipmentTypeFilter === "all" ||
        item.shipmentType === shipmentTypeFilter;

      return searchMatch && statusMatch && dateMatch && shipmentMatch;
    });
  };

  const tabs = [
    {
      id: "jobs",
      label: "Jobs",
      icon: Package,
      count: data?.jobsList?.length || 0,
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      id: "quotes",
      label: "Quotes",
      icon: FileText,
      count: data?.quotesList?.length || 0,
      gradient: "from-green-500 to-emerald-600",
    },
    {
      id: "clients",
      label: "Clients",
      icon: Users,
      count: data?.clientActivity?.length || 0,
      gradient: "from-purple-500 to-pink-600",
    },
    {
      id: "admins",
      label: "Admin Performance",
      icon: TrendingUp,
      count: data?.adminPerformance?.length || 0,
      gradient: "from-orange-500 to-amber-600",
    },
    {
      id: "audit",
      label: "Audit Logs",
      icon: Calendar,
      count: data?.recentAuditLogs?.length || 0,
      gradient: "from-cyan-500 to-blue-600",
    },
  ];

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-blue-200 animate-ping opacity-75" />
            <div className="relative w-16 h-16 rounded-full border-4 border-t-blue-600 border-r-blue-400 border-b-blue-200 border-l-transparent animate-spin" />
          </div>
          <p className="text-gray-600 font-medium">Loading detailed analytics...</p>
        </div>
      </div>
    );
  }

  const activeTabData = tabs.find((t) => t.id === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-down {
          animation: slideDown 0.3s ease-out;
        }

        .table-row-hover:hover {
          transform: translateX(4px);
          transition: all 0.2s ease;
        }
      `}</style>

      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-2 tracking-tight">
            Detailed Analytics
          </h1>
          <p className="text-lg text-gray-600">
            Comprehensive data view with advanced filtering and export capabilities
          </p>
        </div>

        {/* Main Card Container */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Tabs */}
          <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex overflow-x-auto hide-scrollbar">
              {tabs.map((tab, index) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className="relative flex items-center gap-3 px-8 py-5 font-semibold transition-all whitespace-nowrap group"
                    style={{
                      animation: `slideDown ${0.3 + index * 0.1}s ease-out`,
                    }}
                  >
                    {/* Active Indicator */}
                    {isActive && (
                      <div
                        className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${tab.gradient} rounded-t-full`}
                      />
                    )}

                    {/* Icon with Gradient */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        isActive
                          ? `bg-gradient-to-r ${tab.gradient} shadow-lg`
                          : "bg-gray-100 group-hover:bg-gray-200"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          isActive ? "text-white" : "text-gray-600"
                        }`}
                      />
                    </div>

                    {/* Label */}
                    <div className="flex flex-col items-start">
                      <span
                        className={`text-sm ${
                          isActive
                            ? "text-gray-900"
                            : "text-gray-600 group-hover:text-gray-900"
                        }`}
                      >
                        {tab.label}
                      </span>
                      <span
                        className={`text-xs font-bold ${
                          isActive ? "text-blue-600" : "text-gray-400"
                        }`}
                      >
                        {tab.count} records
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filter Section */}
          <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-b border-gray-200">
            <div className="p-6">
              {/* Filter Toggle */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-semibold transition-colors"
                >
                  <Filter className="w-5 h-5" />
                  <span>{showFilters ? "Hide" : "Show"} Filters</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      showFilters ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div className="flex gap-3">
                  {(searchTerm ||
                    statusFilter !== "all" ||
                    dateFrom ||
                    dateTo ||
                    shipmentTypeFilter !== "all") && (
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setStatusFilter("all");
                        setDateFrom("");
                        setDateTo("");
                        setShipmentTypeFilter("all");
                      }}
                      className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm"
                    >
                      <X className="w-4 h-4" />
                      Clear Filters
                    </button>
                  )}
                  <button
                    onClick={() => {
                      const dataMap = {
                        jobs: data.jobsList,
                        quotes: data.quotesList,
                        clients: data.clientActivity,
                        admins: data.adminPerformance,
                        audit: data.recentAuditLogs,
                      };
                      exportToCSV(
                        filterData(dataMap[activeTab]),
                        `${activeTab}-analytics`
                      );
                    }}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-xl transition-all font-semibold flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export CSV
                  </button>
                </div>
              </div>

              {/* Filters Grid */}
              {showFilters && (
                <div className="animate-slide-down">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search anything..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all"
                      />
                    </div>

                    {/* Status Filter */}
                    {(activeTab === "jobs" || activeTab === "quotes") && (
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white font-medium shadow-sm cursor-pointer transition-all"
                      >
                        <option value="all">All Status</option>
                        {activeTab === "jobs" && (
                          <>
                            <option value="new">New</option>
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                          </>
                        )}
                        {activeTab === "quotes" && (
                          <>
                            <option value="pending">Pending</option>
                            <option value="reviewing">Reviewing</option>
                            <option value="indicative_sent">Indicative Sent</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                          </>
                        )}
                      </select>
                    )}

                    {/* Shipment Type Filter */}
                    {(activeTab === "jobs" || activeTab === "quotes") && (
                      <select
                        value={shipmentTypeFilter}
                        onChange={(e) => setShipmentTypeFilter(e.target.value)}
                        className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white font-medium shadow-sm cursor-pointer transition-all"
                      >
                        <option value="all">All Types</option>
                        <option value="import">Import</option>
                        <option value="export">Export</option>
                        <option value="courier">Courier</option>
                      </select>
                    )}

                    {/* Date From */}
                    <div className="relative">
                      <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all"
                        placeholder="From Date"
                      />
                    </div>

                    {/* Date To */}
                    <div className="relative">
                      <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all"
                        placeholder="To Date"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 bg-white">
            {/* Jobs Tab */}
            {activeTab === "jobs" && (
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Job Number
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Source
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Revenue
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Created
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filterData(data.jobsList).map((job, index) => (
                      <tr
                        key={job._id}
                        className="table-row-hover hover:bg-blue-50 cursor-pointer"
                        style={{
                          animation: `slideDown ${0.05 * index}s ease-out`,
                        }}
                      >
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">
                          {job.jobNumber || job.jobId}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                          {job.company}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                              job.status === "completed"
                                ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
                                : job.status === "active"
                                ? "bg-gradient-to-r from-blue-400 to-indigo-500 text-white"
                                : "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-700"
                            }`}
                          >
                            {job.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {job.shipmentType || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {job.source}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">
                          {job.revenue
                            ? `₹${(job.revenue / 1000).toFixed(1)}K`
                            : "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(job.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Quotes Tab */}
            {activeTab === "quotes" && (
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Reference No
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Route
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Job Created
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filterData(data.quotesList).map((quote, index) => (
                      <tr
                        key={quote._id}
                        className="table-row-hover hover:bg-green-50 cursor-pointer"
                        style={{
                          animation: `slideDown ${0.05 * index}s ease-out`,
                        }}
                      >
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">
                          {quote.referenceNo}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                          {quote.company}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                              quote.status === "approved"
                                ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
                                : quote.status === "rejected"
                                ? "bg-gradient-to-r from-red-400 to-rose-500 text-white"
                                : quote.status === "indicative_sent"
                                ? "bg-gradient-to-r from-blue-400 to-indigo-500 text-white"
                                : "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-700"
                            }`}
                          >
                            {quote.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                          {quote.fromCountry} → {quote.toCountry}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {quote.shipmentType}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {quote.hasLinkedJob ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100">
                              <span className="text-green-600 font-bold">✓</span>
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(quote.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Clients Tab */}
            {activeTab === "clients" && (
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Client Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Total Jobs
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Completed
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Revenue
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Quotes
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Conversion
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Last Activity
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filterData(data.clientActivity).map((client, idx) => (
                      <tr
                        key={idx}
                        className="table-row-hover hover:bg-purple-50 cursor-pointer"
                        style={{
                          animation: `slideDown ${0.05 * idx}s ease-out`,
                        }}
                      >
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">
                          {client.clientName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                          {client.company}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">
                          {client.totalJobs}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {client.completedJobs}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-green-600">
                          ₹{(client.totalRevenue / 1000).toFixed(1)}K
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {client.quotesRequested}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                              client.quotesApproved / client.quotesRequested >
                              0.7
                                ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
                                : client.quotesApproved /
                                    client.quotesRequested >
                                  0.4
                                ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-white"
                                : "bg-gradient-to-r from-red-400 to-rose-500 text-white"
                            }`}
                          >
                            {client.quotesRequested > 0
                              ? Math.round(
                                  (client.quotesApproved /
                                    client.quotesRequested) *
                                    100
                                )
                              : 0}
                            %
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(client.lastActivity).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Admin Performance Tab */}
            {activeTab === "admins" && (
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Admin Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Total Actions
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Jobs Handled
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Quotes Processed
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Avg Response Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {data.adminPerformance.map((admin, idx) => (
                      <tr
                        key={idx}
                        className="table-row-hover hover:bg-orange-50 cursor-pointer"
                        style={{
                          animation: `slideDown ${0.05 * idx}s ease-out`,
                        }}
                      >
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">
                          {admin.adminName}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className="px-3 py-1.5 bg-gradient-to-r from-blue-400 to-indigo-500 text-white rounded-full text-xs font-bold shadow-sm">
                            {admin.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">
                          {admin.totalActions}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {admin.jobsHandled}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {admin.quotesProcessed}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {admin.avgResponseTime}h
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Audit Logs Tab */}
            {activeTab === "audit" && (
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Action
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Entity Type
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Performed By
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filterData(data.recentAuditLogs).map((log, index) => (
                      <tr
                        key={log._id}
                        className="table-row-hover hover:bg-cyan-50 cursor-pointer"
                        style={{
                          animation: `slideDown ${0.05 * index}s ease-out`,
                        }}
                      >
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">
                          {log.action}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className="px-3 py-1.5 bg-gradient-to-r from-purple-400 to-pink-500 text-white rounded-full text-xs font-bold shadow-sm">
                            {log.entityType}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-md truncate">
                          {log.description}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {log.performedBy || "System"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {log.performedByRole || "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Empty State */}
            {activeTab === "jobs" &&
              filterData(data.jobsList).length === 0 && (
                <div className="text-center py-16">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg font-medium">
                    No jobs found
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    Try adjusting your filters
                  </p>
                </div>
              )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}