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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
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
  ArrowUpRight,
  Briefcase,
  Target,
  Zap,
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
    quotesToJobConversionRate: number;
    quotesConvertedToJobs: number;
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
  gradient: string;
  delay?: number;
}

const MetricCard = ({
  title,
  value,
  icon,
  trend,
  subtitle,
  gradient,
  delay = 0,
}: MetricCardProps) => (
  <div
    className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 min-h-[180px]"
    style={{ 
      animationDelay: `${delay}ms`,
      animation: 'slideUp 0.6s ease-out forwards',
      opacity: 0,
    }}
  >
    {/* Gradient Background Accent */}
    <div
      className="absolute top-0 right-0 w-32 h-32 opacity-10 group-hover:opacity-20 transition-opacity duration-500 rounded-full blur-3xl"
      style={{ background: gradient }}
    />
    
    <div className="relative flex flex-col h-full">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 pr-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 line-clamp-2">
            {title}
          </p>
          <p className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1 tracking-tight break-words">
            {value}
          </p>
        </div>
        <div
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500 flex-shrink-0"
          style={{ background: gradient }}
        >
          <div className="text-white">{icon}</div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="mt-auto">
        {subtitle && (
          <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">{subtitle}</p>
        )}
        {trend && (
          <div className="flex items-center space-x-2">
            <div
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                trend.isPositive
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {trend.isPositive ? (
                <TrendingUp className="w-3.5 h-3.5 flex-shrink-0" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 flex-shrink-0" />
              )}
              <span>{trend.value}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

const GRADIENTS = {
  blue: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  green: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
  orange: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
  purple: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
  indigo: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
  pink: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
  teal: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
  red: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
};

const PIE_COLORS = ["#667eea", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export default function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30");
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-blue-200 animate-ping opacity-75" />
            <div className="relative w-16 h-16 rounded-full border-4 border-t-blue-600 border-r-blue-400 border-b-blue-200 border-l-transparent animate-spin" />
          </div>
          <p className="text-gray-600 font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-rose-50">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-red-600 text-xl font-bold mb-2">Error Loading Analytics</p>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchMetrics}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .chart-card {
          animation: fadeIn 0.8s ease-out forwards;
          opacity: 0;
        }

        .chart-card:nth-child(1) { animation-delay: 100ms; }
        .chart-card:nth-child(2) { animation-delay: 200ms; }
        .chart-card:nth-child(3) { animation-delay: 300ms; }
        .chart-card:nth-child(4) { animation-delay: 400ms; }
      `}</style>

      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-10 animate-[slideUp_0.6s_ease-out]">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-2 tracking-tight">
                Analytics Dashboard
              </h1>
              <p className="text-lg text-gray-600">
                Real-time insights into your business performance
              </p>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white font-semibold text-gray-700 cursor-pointer hover:border-blue-300 transition-colors shadow-sm"
              >
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 90 Days</option>
                <option value="365">Last Year</option>
                <option value="all">All Time</option>
              </select>
              <button
                onClick={fetchMetrics}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <Zap className="w-5 h-5" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid - Row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <MetricCard
            title="Total Jobs"
            value={metrics.jobs.total}
            subtitle={`${metrics.jobs.completed} completed`}
            icon={<Package className="w-7 h-7" />}
            gradient={GRADIENTS.blue}
            trend={{
              value: metrics.jobs.completionRate,
              isPositive: metrics.jobs.completionRate > 75,
            }}
            delay={0}
          />
          <MetricCard
            title="Quote Acceptance"
            value={`${metrics.quotes.conversionRate}%`}
            subtitle={`${Math.round((metrics.quotes.conversionRate / 100) * metrics.quotes.total)} of ${metrics.quotes.total} accepted`}
            icon={<FileText className="w-7 h-7" />}
            gradient={GRADIENTS.green}
            trend={{
              value: metrics.quotes.conversionRate,
              isPositive: metrics.quotes.conversionRate > 50,
            }}
            delay={100}
          />
          <MetricCard
            title="Quote to Job"
            value={`${metrics.quotes.quotesToJobConversionRate}%`}
            subtitle={`${metrics.quotes.quotesConvertedToJobs} actual sales`}
            icon={<Target className="w-7 h-7" />}
            gradient={GRADIENTS.indigo}
            trend={{
              value: metrics.quotes.quotesToJobConversionRate,
              isPositive: metrics.quotes.quotesToJobConversionRate > 40,
            }}
            delay={200}
          />
        </div>

        {/* Key Metrics Grid - Row 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          <MetricCard
            title="Total Revenue"
            value={`₹${(metrics.revenue.total / 1000).toFixed(1)}K`}
            subtitle="All currencies combined"
            icon={<IndianRupee className="w-7 h-7" />}
            gradient={GRADIENTS.orange}
            delay={300}
          />
          <MetricCard
            title="Active Clients"
            value={metrics.clients.converted}
            subtitle={`${metrics.clients.total} total clients`}
            icon={<Users className="w-7 h-7" />}
            gradient={GRADIENTS.purple}
            delay={400}
          />
        </div>

        {/* Performance Overview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Job Status Pie Chart */}
          <div className="chart-card bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full" />
              Job Status
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={[
                    { name: "New", value: metrics.jobs.new },
                    { name: "Active", value: metrics.jobs.active },
                    { name: "Completed", value: metrics.jobs.completed },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {[0, 1, 2].map((index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                    padding: "12px 16px",
                  }}
                  formatter={(value: any) => [value.toLocaleString(), ""]}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  formatter={(value) => (
                    <span className="text-sm font-medium text-gray-700">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Quote Pipeline Bar Chart */}
          <div className="chart-card bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300 lg:col-span-2">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full" />
              Quote Pipeline
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={[
                  { status: "Pending", count: metrics.quotes.pending },
                  { status: "Reviewing", count: metrics.quotes.reviewing },
                  { status: "Sent", count: metrics.quotes.indicativeSent },
                  { status: "Approved", count: metrics.quotes.approved },
                  { status: "Rejected", count: metrics.quotes.rejected },
                ]}
              >
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#059669" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="status"
                  tick={{ fill: "#6b7280", fontSize: 13, fontWeight: 600 }}
                />
                <YAxis tick={{ fill: "#6b7280", fontSize: 13, fontWeight: 600 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                    padding: "12px 16px",
                  }}
                  formatter={(value: any) => [value.toLocaleString(), "Count"]}
                />
                <Bar dataKey="count" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trends Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* Jobs Trend */}
          <div className="chart-card bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-indigo-600 rounded-full" />
              Jobs Created vs Completed
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={metrics.trends.jobsByMonth}>
                <defs>
                  <linearGradient id="createdGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#6b7280", fontSize: 12, fontWeight: 600 }}
                />
                <YAxis tick={{ fill: "#6b7280", fontSize: 12, fontWeight: 600 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                    padding: "12px 16px",
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: "20px" }}
                  iconType="circle"
                  formatter={(value) => (
                    <span className="text-sm font-semibold text-gray-700">
                      {value}
                    </span>
                  )}
                />
                <Area
                  type="monotone"
                  dataKey="created"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#createdGradient)"
                  name="Created"
                />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#completedGradient)"
                  name="Completed"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Trend */}
          <div className="chart-card bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-2 h-8 bg-gradient-to-b from-orange-500 to-amber-600 rounded-full" />
              Revenue Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metrics.trends.revenueByMonth}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#6b7280", fontSize: 12, fontWeight: 600 }}
                />
                <YAxis tick={{ fill: "#6b7280", fontSize: 12, fontWeight: 600 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                    padding: "12px 16px",
                  }}
                  formatter={(value: any) => [`₹${value.toLocaleString()}`, "Revenue"]}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="url(#revenueGradient)"
                  strokeWidth={4}
                  dot={{ fill: "#f59e0b", r: 6, strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 8 }}
                  name="Revenue (INR)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* Shipment Type Revenue */}
          <div className="chart-card bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-2 h-8 bg-gradient-to-b from-teal-500 to-cyan-600 rounded-full" />
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
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, value }: any) =>
                    `${name}: ₹${(value / 1000).toFixed(1)}K`
                  }
                >
                  {[0, 1, 2].map((index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={[PIE_COLORS[0], PIE_COLORS[1], PIE_COLORS[2]][index]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                    padding: "12px 16px",
                  }}
                  formatter={(value: any) => [`₹${value.toLocaleString()}`, ""]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Technical Quote Status */}
          <div className="chart-card bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-2 h-8 bg-gradient-to-b from-pink-500 to-rose-600 rounded-full" />
              Technical Quote Performance
            </h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-semibold">Total Technical Quotes</span>
                <span className="text-2xl font-bold text-gray-900">
                  {metrics.technicalQuotes.total}
                </span>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-600">Approval Rate</span>
                  <span className="text-lg font-bold text-emerald-600">
                    {metrics.technicalQuotes.approvalRate}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 transition-all duration-1000 ease-out"
                    style={{
                      width: `${metrics.technicalQuotes.approvalRate}%`,
                    }}
                  />
                </div>
              </div>

              <div className="flex justify-between gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-700 font-semibold">
                    {metrics.technicalQuotes.clientApproved} Approved
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span className="text-red-700 font-semibold">
                    {metrics.technicalQuotes.clientRejected} Rejected
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                  <div className="text-xs text-gray-600 font-semibold mb-1">Draft</div>
                  <div className="text-2xl font-bold text-blue-700">
                    {metrics.technicalQuotes.draft}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-4 rounded-xl border border-amber-100">
                  <div className="text-xs text-gray-600 font-semibold mb-1">Review</div>
                  <div className="text-2xl font-bold text-amber-700">
                    {metrics.technicalQuotes.internalReview}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
                  <div className="text-xs text-gray-600 font-semibold mb-1">Sent</div>
                  <div className="text-2xl font-bold text-purple-700">
                    {metrics.technicalQuotes.sentToClient}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Currency Breakdown */}
        <div className="chart-card bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300 mb-10">
          <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <div className="w-2 h-8 bg-gradient-to-b from-indigo-500 to-blue-600 rounded-full" />
            Revenue by Currency
          </h3>
          <p className="text-sm text-gray-500 mb-8">
            Total amounts collected in each currency (before INR conversion)
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* INR */}
            <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-6 text-white group hover:scale-105 transition-transform duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <span className="text-2xl font-bold">₹</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium opacity-90">Indian Rupee</p>
                    <p className="text-xs opacity-75">INR</p>
                  </div>
                </div>
                <p className="text-4xl font-bold mb-2">
                  ₹{(metrics.revenue.byCurrency.INR / 1000).toFixed(1)}K
                </p>
                <p className="text-sm opacity-90">
                  {metrics.revenue.byCurrency.INR.toLocaleString()} INR
                </p>
              </div>
            </div>

            {/* USD */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white group hover:scale-105 transition-transform duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <span className="text-2xl font-bold">$</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium opacity-90">US Dollar</p>
                    <p className="text-xs opacity-75">USD</p>
                  </div>
                </div>
                <p className="text-4xl font-bold mb-2">
                  ${(metrics.revenue.byCurrency.USD / 1000).toFixed(1)}K
                </p>
                <p className="text-sm opacity-90">
                  {metrics.revenue.byCurrency.USD.toLocaleString()} USD
                </p>
              </div>
            </div>

            {/* EUR */}
            <div className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white group hover:scale-105 transition-transform duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <span className="text-2xl font-bold">€</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium opacity-90">Euro</p>
                    <p className="text-xs opacity-75">EUR</p>
                  </div>
                </div>
                <p className="text-4xl font-bold mb-2">
                  €{(metrics.revenue.byCurrency.EUR / 1000).toFixed(1)}K
                </p>
                <p className="text-sm opacity-90">
                  {metrics.revenue.byCurrency.EUR.toLocaleString()} EUR
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Top Clients & Admin Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* Top Clients */}
          <div className="chart-card bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-2 h-8 bg-gradient-to-b from-violet-500 to-purple-600 rounded-full" />
              Top Clients by Revenue
            </h3>
            <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
              {metrics.clients.topClients.slice(0, 10).map((client, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-transparent rounded-xl hover:from-blue-50 hover:shadow-md transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {client.name}
                      </p>
                      <p className="text-sm text-gray-500">{client.jobCount} jobs</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      ₹{(client.revenue / 1000).toFixed(1)}K
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Admin Activity */}
          <div className="chart-card bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-2 h-8 bg-gradient-to-b from-rose-500 to-red-600 rounded-full" />
              Admin Activity
            </h3>
            <div className="mb-6">
              <p className="text-4xl font-bold text-gray-900">
                {metrics.adminActivity.totalActions.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 mt-1">Total actions logged</p>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={metrics.adminActivity.byAdmin.slice(0, 8)}
                layout="vertical"
              >
                <defs>
                  <linearGradient id="adminGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" tick={{ fill: "#6b7280", fontSize: 12 }} />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={120}
                  tick={{ fill: "#6b7280", fontSize: 12, fontWeight: 600 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                    padding: "12px 16px",
                  }}
                  formatter={(value: any) => [value.toLocaleString(), "Actions"]}
                />
                <Bar dataKey="actions" fill="url(#adminGradient)" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action Types Grid */}
        <div className="chart-card bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <div className="w-2 h-8 bg-gradient-to-b from-cyan-500 to-blue-600 rounded-full" />
            Most Common Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {metrics.adminActivity.byActionType.slice(0, 12).map((item, index) => (
              <div
                key={index}
                className="relative overflow-hidden group"
                style={{
                  animation: `slideUp 0.5s ease-out ${index * 50}ms forwards`,
                  opacity: 0,
                }}
              >
                <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-5 text-center hover:shadow-lg hover:scale-105 transition-all duration-300 border border-blue-100">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{item.count}</p>
                  <p
                    className="text-xs text-gray-600 font-medium truncate"
                    title={item.action}
                  >
                    {item.action}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #764ba2 0%, #667eea 100%);
        }
      `}</style>
    </div>
  );
}