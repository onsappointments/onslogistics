
"use client";

import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Globe2,
  Info,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

function formatDate(value) {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not available";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatPeriod(period) {
  if (!period) return "Unknown period";

  const [year, month] = period.split("-").map(Number);

  if (!year || !month) return period;

  return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString(
    "en-IN",
    {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }
  );
}

function CoverageStatus({ status }) {
  if (status === "complete") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
        <CheckCircle2 size={13} />
        Complete coverage
      </span>
    );
  }

  if (status === "partial") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
        <Info size={13} />
        Partial coverage
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600">
      <AlertCircle size={13} />
      No coverage
    </span>
  );
}

function PeriodList({ title, periods, variant = "gray" }) {
  if (!periods?.length) return null;

  const styles = {
    amber: "border-amber-100 bg-amber-50 text-amber-800",
    red: "border-red-100 bg-red-50 text-red-800",
    gray: "border-gray-100 bg-gray-50 text-gray-700",
  };

  return (
    <div>
      <p className="mb-2 text-xs font-semibold text-gray-600">
        {title}
        <span className="ml-1 font-normal text-gray-400">
          ({periods.length})
        </span>
      </p>

      <div className="flex flex-wrap gap-2">
        {periods.map((period) => (
          <span
            key={period}
            className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium ${styles[variant]}`}
          >
            {formatPeriod(period)}
          </span>
        ))}
      </div>
    </div>
  );
}

function MetadataItem({ label, value, icon: Icon }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 rounded-lg bg-gray-100 p-2 text-gray-500">
        <Icon size={16} />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="mt-1 break-words text-sm font-medium text-gray-800">
          {value || "Not available"}
        </p>
      </div>
    </div>
  );
}

export default function TradeFlowDataCoverage({
  coverage,
  dataSource,
  loading = false,
}) {
  const percentage = Math.max(
    0,
    Math.min(100, Number(coverage?.coveragePercentage) || 0)
  );

  const missingMonths = coverage?.missingMonths || [];
  const incompleteMonths = coverage?.incompleteMonths || [];

  const hasSourceError = Boolean(dataSource?.lastError);
  const failureCount = Number(dataSource?.consecutiveFailures || 0);

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <p className="text-sm font-medium text-blue-600">
            DATA TRANSPARENCY
          </p>

          <h2 className="mt-1 text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
            Data coverage & source
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Understand the reporting coverage, source and update history
            behind these trade statistics.
          </p>
        </div>

        <CoverageStatus status={coverage?.status} />
      </div>

      {/* Coverage summary */}
      <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50/70 p-4 sm:p-5">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-gray-600">
              Reporting coverage
            </p>

            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-semibold tracking-tight text-gray-900">
                {loading ? "—" : `${percentage.toFixed(2)}%`}
              </span>

              <span className="text-sm text-gray-500">
                {coverage
                  ? `${coverage.completeMonths} of ${coverage.requestedMonths} months complete`
                  : "Coverage unavailable"}
              </span>
            </div>
          </div>

          <p className="text-xs text-gray-500">
            {coverage?.firstAvailablePeriod && coverage?.latestAvailablePeriod
              ? `${formatPeriod(coverage.firstAvailablePeriod)} – ${formatPeriod(
                  coverage.latestAvailablePeriod
                )}`
              : "Historical period unavailable"}
          </p>
        </div>

        <div
          className="mt-4 h-2.5 overflow-hidden rounded-full bg-gray-200"
          role="progressbar"
          aria-label="Complete reporting coverage"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-500">
          <span>
            <span className="font-semibold text-emerald-600">
              {coverage?.completeMonths ?? 0}
            </span>{" "}
            complete
          </span>

          <span>
            <span className="font-semibold text-amber-600">
              {incompleteMonths.length}
            </span>{" "}
            incomplete
          </span>

          <span>
            <span className="font-semibold text-gray-700">
              {missingMonths.length}
            </span>{" "}
            missing
          </span>
        </div>
      </div>

      {/* Missing periods */}
      {(missingMonths.length > 0 || incompleteMonths.length > 0) && (
        <div className="mt-6 space-y-5">
          <PeriodList
            title="Months without available records"
            periods={missingMonths}
            variant="amber"
          />

          <PeriodList
            title="Months with incomplete reporting"
            periods={incompleteMonths}
            variant="red"
          />
        </div>
      )}

      {coverage?.status === "complete" && (
        <div className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
          <CheckCircle2 size={17} />
          All requested months have complete import and export records.
        </div>
      )}

      <div className="my-6 border-t border-gray-100" />

      {/* Source information */}
      <div>
        <div className="mb-5 flex items-center gap-2">
          <Globe2 size={18} className="text-blue-600" />
          <h3 className="text-base font-semibold text-gray-900">
            Data source information
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <MetadataItem
            icon={Globe2}
            label="Data provider"
            value={dataSource?.name}
          />

          <MetadataItem
            icon={RefreshCw}
            label="Update frequency"
            value={dataSource?.updateFrequency}
          />

          <MetadataItem
            icon={CheckCircle2}
            label="Last successful update"
            value={formatDate(dataSource?.lastSuccessAt)}
          />

          <MetadataItem
            icon={Clock3}
            label="Last update attempt"
            value={formatDate(dataSource?.lastAttemptAt)}
          />
        </div>

        {dataSource?.attribution && (
          <div className="mt-5 rounded-xl bg-gray-50 p-4">
            <p className="text-xs font-semibold text-gray-500">
              SOURCE ATTRIBUTION
            </p>

            <p className="mt-1 text-sm leading-6 text-gray-700">
              {dataSource.attribution}
            </p>
          </div>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-3">
          {dataSource?.websiteUrl && (
            <a
              href={dataSource.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 transition hover:border-blue-200 hover:text-blue-700"
            >
              Visit source
              <ExternalLink size={13} />
            </a>
          )}

          {dataSource?.dataUrl && (
            <a
              href={dataSource.dataUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 transition hover:border-blue-200 hover:text-blue-700"
            >
              API documentation
              <ExternalLink size={13} />
            </a>
          )}
        </div>
      </div>

      {/* Ingestion health */}
      <div className="mt-6 border-t border-gray-100 pt-5">
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} className="text-gray-500" />
          <h3 className="text-sm font-semibold text-gray-900">
            Data ingestion health
          </h3>
        </div>

        {hasSourceError ? (
          <div className="mt-3 rounded-xl border border-red-100 bg-red-50 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-red-700">
              <AlertCircle size={16} />
              Last ingestion reported an error
            </div>

            <p className="mt-2 break-words text-xs leading-5 text-red-700">
              {dataSource.lastError}
            </p>
          </div>
        ) : (
          <div className="mt-3 flex items-start gap-2 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700">
            <CheckCircle2 size={17} className="mt-0.5 shrink-0" />

            <div>
              <p className="font-medium">No reported ingestion error</p>
              <p className="mt-1 text-xs text-emerald-700">
                The latest ingestion status does not report an error.
              </p>
            </div>
          </div>
        )}

        {failureCount > 0 && (
          <p className="mt-3 text-xs text-amber-700">
            Consecutive ingestion failures: {failureCount}
          </p>
        )}
      </div>

      <p className="mt-5 border-t border-gray-100 pt-4 text-xs leading-5 text-gray-400">
        Reporting coverage reflects the selected dashboard period. Missing
        observations are not interpreted as zero trade value. Data may be
        revised by the original reporting authority.
      </p>
    </section>
  );
}
