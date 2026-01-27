"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  FileText,
  CheckCircle,
  XCircle,
  Users,
  DollarSign,
  Activity,
  Package,
  Clock,
  IndianRupee,
} from "lucide-react";

// Types
interface DashboardMetrics {
  jobs: {
    total: number;
    new: number;
    active: number;
    completed: number;
    completionRate: number;
  };
  quotes: {
    total: number;
    pending: number;
    reviewing: number;
    indicativeSent: number;
    approved: number;
    rejected: number;
    conversionRate: number;
  };
  technicalQuotes: {
    total: number;
    draft: number;
    internalReview: number;
    sentToClient: number;
    clientApproved: number;
    clientRejected: number;
    approvalRate: number;
  };
  revenue: {
    total: number;
    byShipmentType: { import: number; export: number; courier: number };
    byCurrency: { INR: number; USD: number; EUR: number };
  };
  clients: {
    total: number;
    verified: number;
    leads: number;
    converted: number;
    topClients: Array<{ name: string; revenue: number; jobCount: number }>;
  };
  adminActivity: {
    totalActions: number;
    byAdmin: Array<{ name: string; actions: number; role: string }>;
    byActionType: Array<{ action: string; count: number }>;
  };
  trends: {
    jobsByMonth: Array<{ month: string; created: number; completed: number }>;
    quotesByMonth: Array<{ month: string; received: number; approved: number }>;
    revenueByMonth: Array<{ month: string; revenue: number }>;
  };
}

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: number; isPositive: boolean };
  subtitle?: string;
  color: string;
}

const MetricCard = ({
  title,
  value,
  icon,
  trend,
  subtitle,
  color,
}: MetricCardProps) => (
  <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderLeftColor: color }}>
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        )}
        {trend && (
          <div className="flex items-center mt-2">
            {trend.isPositive ? (
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
            )}
            <span
              className={`text-sm font-medium ${
                trend.isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend.value}%
            </span>
          </div>
        )}
      </div>
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center"
        style={{ backgroundColor: `${color}20` }}
      >
        {icon}
      </div>
    </div>
  </div>
);

const COLORS = {
  primary: "#3B82F6",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  purple: "#8B5CF6",
  indigo: "#6366F1",
  pink: "#EC4899",
  teal: "#14B8A6",
};

const PIE_COLORS = [
  COLORS.primary,
  COLORS.success,
  COLORS.warning,
  COLORS.danger,
  COLORS.purple,
  COLORS.indigo,
];

export default function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30"); // days
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMetrics();
  }, [dateRange]);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics/dashboard?days=${dateRange}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch analytics data");
      }
      
      const data = await response.json();
      setMetrics(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">Error loading analytics</p>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={fetchMetrics}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Comprehensive overview of company performance
            </p>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
              <option value="365">Last Year</option>
              <option value="all">All Time</option>
            </select>
            <button
              onClick={fetchMetrics}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Jobs"
          value={metrics.jobs.total}
          subtitle={`${metrics.jobs.completed} completed`}
          icon={<Package className="w-6 h-6" style={{ color: COLORS.primary }} />}
          color={COLORS.primary}
          trend={{
            value: metrics.jobs.completionRate,
            isPositive: metrics.jobs.completionRate > 75,
          }}
        />
        <MetricCard
          title="Quote Conversion"
          value={`${metrics.quotes.conversionRate}%`}
          subtitle={`${metrics.quotes.approved} / ${metrics.quotes.total} approved`}
          icon={<FileText className="w-6 h-6" style={{ color: COLORS.success }} />}
          color={COLORS.success}
          trend={{
            value: metrics.quotes.conversionRate,
            isPositive: metrics.quotes.conversionRate > 50,
          }}
        />
        <MetricCard
          title="Total Revenue"
          value={`₹${(metrics.revenue.total / 1000).toFixed(1)}K`}
          subtitle="All currencies combined"
          icon={<IndianRupee className="w-6 h-6" style={{ color: COLORS.warning }} />}
          color={COLORS.warning}
        />
        <MetricCard
          title="Active Clients"
          value={metrics.clients.converted}
          subtitle={`${metrics.clients.total} total clients`}
          icon={<Users className="w-6 h-6" style={{ color: COLORS.purple }} />}
          color={COLORS.purple}
        />
      </div>

      {/* Job Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Job Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: "New", value: metrics.jobs.new },
                  { name: "Active", value: metrics.jobs.active },
                  { name: "Completed", value: metrics.jobs.completed },
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({
                  name,
                  percent,
                }: {
                  name?: string;
                  percent?: number;
                }) => `${name ?? ""}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {[0, 1, 2].map((index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number | string | undefined) => 
                  value !== undefined ? Number(value).toLocaleString() : '0'
                }
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quote Pipeline
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                { status: "Pending", count: metrics.quotes.pending },
                { status: "Reviewing", count: metrics.quotes.reviewing },
                { status: "Indicative Sent", count: metrics.quotes.indicativeSent },
                { status: "Approved", count: metrics.quotes.approved },
                { status: "Rejected", count: metrics.quotes.rejected },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip 
                formatter={(value: number | string | undefined) => 
                  value !== undefined ? Number(value).toLocaleString() : '0'
                }
              />
              <Bar dataKey="count" fill={COLORS.primary} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trends Over Time */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Jobs Created vs Completed
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={metrics.trends.jobsByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                      formatter={(value: number | string | undefined) => 
          value !== undefined ? Number(value).toLocaleString() : '0'
        }
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="created"
                stackId="1"
                stroke={COLORS.primary}
                fill={COLORS.primary}
                name="Created"
              />
              <Area
                type="monotone"
                dataKey="completed"
                stackId="2"
                stroke={COLORS.success}
                fill={COLORS.success}
                name="Completed"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Revenue Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metrics.trends.revenueByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value: number | string | undefined) => 
                  value !== undefined ? `₹${Number(value).toLocaleString()}` : '₹0'
                }
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke={COLORS.warning}
                strokeWidth={2}
                name="Revenue (INR)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Revenue by Shipment Type
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  {
                    name: "Import",
                    value: metrics.revenue.byShipmentType.import,
                  },
                  {
                    name: "Export",
                    value: metrics.revenue.byShipmentType.export,
                  },
                  {
                    name: "Courier",
                    value: metrics.revenue.byShipmentType.courier,
                  },
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({
                  name,
                  value,
                }: {
                  name?: string;
                  value?: number;
                }) => `${name ?? ""}: ₹${((value ?? 0) / 1000).toFixed(1)}K`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {[0, 1, 2].map((index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value: number | string | undefined) => 
                value !== undefined ? `₹${Number(value).toLocaleString()}` : '₹0'
              } />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Technical Quote Approval Rate
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Technical Quotes</span>
              <span className="font-semibold">{metrics.technicalQuotes.total}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-green-500 h-4 rounded-full transition-all"
                style={{
                  width: `${metrics.technicalQuotes.approvalRate}%`,
                }}
              ></div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-green-600">
                ✓ {metrics.technicalQuotes.clientApproved} Approved
              </span>
              <span className="text-red-600">
                ✗ {metrics.technicalQuotes.clientRejected} Rejected
              </span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="text-center p-2 bg-blue-50 rounded">
                <div className="text-sm text-gray-600">Draft</div>
                <div className="text-lg font-semibold">{metrics.technicalQuotes.draft}</div>
              </div>
              <div className="text-center p-2 bg-yellow-50 rounded">
                <div className="text-sm text-gray-600">Review</div>
                <div className="text-lg font-semibold">{metrics.technicalQuotes.internalReview}</div>
              </div>
              <div className="text-center p-2 bg-purple-50 rounded">
                <div className="text-sm text-gray-600">Sent</div>
                <div className="text-lg font-semibold">{metrics.technicalQuotes.sentToClient}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue by Currency - Original Currency Breakdown */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Revenue by Currency
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Total amounts collected in each currency (before INR conversion)
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* INR Card */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">₹</span>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Indian Rupee</p>
                <p className="text-xs text-gray-500">INR</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              ₹{(metrics.revenue.byCurrency.INR / 1000).toFixed(1)}K
            </p>
            <p className="text-sm text-gray-600 mt-2">
              {metrics.revenue.byCurrency.INR.toLocaleString()} INR
            </p>
          </div>

          {/* USD Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">$</span>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">US Dollar</p>
                <p className="text-xs text-gray-500">USD</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              ${(metrics.revenue.byCurrency.USD / 1000).toFixed(1)}K
            </p>
            <p className="text-sm text-gray-600 mt-2">
              {metrics.revenue.byCurrency.USD.toLocaleString()} USD
            </p>
          </div>

          {/* EUR Card */}
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border-2 border-purple-200">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">€</span>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Euro</p>
                <p className="text-xs text-gray-500">EUR</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              €{(metrics.revenue.byCurrency.EUR / 1000).toFixed(1)}K
            </p>
            <p className="text-sm text-gray-600 mt-2">
              {metrics.revenue.byCurrency.EUR.toLocaleString()} EUR
            </p>
          </div>
        </div>

        {/* Pie Chart for Currency Distribution */}
        <div className="mt-6">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={[
                  {
                    name: "INR (₹)",
                    value: metrics.revenue.byCurrency.INR,
                  },
                  {
                    name: "USD ($)",
                    value: metrics.revenue.byCurrency.USD * 83, // Convert to INR for comparison
                  },
                  {
                    name: "EUR (€)",
                    value: metrics.revenue.byCurrency.EUR * 90, // Convert to INR for comparison
                  },
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({
                  name,
                  percent,
                }: {
                  name?: string;
                  percent?: number;
                }) => `${name ?? ""}: ${((percent ?? 0) * 100).toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {[0, 1, 2].map((index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={[COLORS.success, COLORS.primary, COLORS.purple][index]}
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number | string | undefined) => 
                  value !== undefined ? `₹${Number(value).toLocaleString()} (equiv)` : '₹0'
                }
              />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-xs text-center text-gray-500 mt-2">
            * Chart shows INR equivalent values for comparison (USD×83, EUR×90)
          </p>
        </div>
      </div>

      {/* Top Clients & Admin Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Clients by Revenue
          </h3>
          <div className="space-y-3">
            {metrics.clients.topClients.slice(0, 10).map((client, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-600">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{client.name}</p>
                    <p className="text-sm text-gray-500">
                      {client.jobCount} jobs
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    ₹{(client.revenue / 1000).toFixed(1)}K
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Admin Activity Overview
          </h3>
          <div className="mb-4">
            <p className="text-3xl font-bold text-gray-900">
              {metrics.adminActivity.totalActions}
            </p>
            <p className="text-sm text-gray-600">Total actions logged</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={metrics.adminActivity.byAdmin.slice(0, 10)}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip 
                formatter={(value: number | string | undefined) => 
                  value !== undefined ? Number(value).toLocaleString() : '0'
                }
              />
              <Bar dataKey="actions" fill={COLORS.indigo} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Action Types Breakdown */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Most Common Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {metrics.adminActivity.byActionType.slice(0, 12).map((item, index) => (
            <div
              key={index}
              className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg text-center hover:shadow-md transition-shadow"
            >
              <Activity className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold text-gray-900">{item.count}</p>
              <p className="text-xs text-gray-600 mt-1 truncate" title={item.action}>
                {item.action}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}