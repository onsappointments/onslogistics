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
      // Search filter
      const searchMatch =
        !searchTerm ||
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        );

      // Status filter
      const statusMatch =
        statusFilter === "all" || item.status === statusFilter;

      // Date filter
      const dateMatch =
        (!dateFrom || new Date(item.createdAt) >= new Date(dateFrom)) &&
        (!dateTo || new Date(item.createdAt) <= new Date(dateTo));

      // Shipment type filter
      const shipmentMatch =
        shipmentTypeFilter === "all" ||
        item.shipmentType === shipmentTypeFilter;

      return searchMatch && statusMatch && dateMatch && shipmentMatch;
    });
  };

  const tabs = [
    { id: "jobs", label: "Jobs", icon: Package, count: data?.jobsList?.length || 0 },
    {
      id: "quotes",
      label: "Quotes",
      icon: FileText,
      count: data?.quotesList?.length || 0,
    },
    {
      id: "clients",
      label: "Clients",
      icon: Users,
      count: data?.clientActivity?.length || 0,
    },
    {
      id: "admins",
      label: "Admin Performance",
      icon: TrendingUp,
      count: data?.adminPerformance?.length || 0,
    },
    {
      id: "audit",
      label: "Audit Logs",
      icon: Calendar,
      count: data?.recentAuditLogs?.length || 0,
    },
  ];

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Detailed Analytics
        </h1>
        <p className="text-gray-600 mt-1">
          Comprehensive data view with advanced filtering
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="flex overflow-x-auto border-b">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filters */}
        <div className="p-4 border-b bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            {(activeTab === "jobs" || activeTab === "quotes") && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="import">Import</option>
                <option value="export">Export</option>
                <option value="courier">Courier</option>
              </select>
            )}

            {/* Date From */}
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="From Date"
            />

            {/* Date To */}
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="To Date"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setDateFrom("");
                setDateTo("");
                setShipmentTypeFilter("all");
              }}
              className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Clear Filters
            </button>
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Jobs Tab */}
          {activeTab === "jobs" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Job Number
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Company
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Source
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Revenue
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filterData(data.jobsList).map((job) => (
                    <tr key={job._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {job.jobNumber || job.jobId}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {job.company}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            job.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : job.status === "active"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {job.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {job.shipmentType || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {job.source}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {job.revenue
                          ? `₹${(job.revenue / 1000).toFixed(1)}K`
                          : "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
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
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Reference No
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Company
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Route
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Job Created
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filterData(data.quotesList).map((quote) => (
                    <tr key={quote._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {quote.referenceNo}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {quote.company}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            quote.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : quote.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : quote.status === "indicative_sent"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {quote.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {quote.fromCountry} → {quote.toCountry}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {quote.shipmentType}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {quote.hasLinkedJob ? (
                          <span className="text-green-600">✓</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
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
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Client Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Company
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Total Jobs
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Completed
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Revenue
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Quotes
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Conversion
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Last Activity
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filterData(data.clientActivity).map((client, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {client.clientName}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {client.company}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {client.totalJobs}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {client.completedJobs}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        ₹{(client.totalRevenue / 1000).toFixed(1)}K
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {client.quotesRequested}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            client.quotesApproved / client.quotesRequested > 0.7
                              ? "bg-green-100 text-green-700"
                              : client.quotesApproved /
                                  client.quotesRequested >
                                0.4
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
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
                      <td className="px-4 py-3 text-sm text-gray-600">
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
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Admin Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Role
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Total Actions
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Jobs Handled
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Quotes Processed
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Avg Response Time
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {data.adminPerformance.map((admin, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {admin.adminName}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                          {admin.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {admin.totalActions}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {admin.jobsHandled}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {admin.quotesProcessed}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
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
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Action
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Entity Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Description
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Performed By
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Role
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filterData(data.recentAuditLogs).map((log) => (
                    <tr key={log._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {log.action}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                          {log.entityType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-md truncate">
                        {log.description}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {log.performedBy || "System"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {log.performedByRole || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(log.createdAt).toLocaleString()}
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
  );
}