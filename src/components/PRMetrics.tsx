"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface PRMetricsData {
  open: number;
  merged: number;
  closed: number;
  avgReviewHours: number;
  mergeRate: number;
}

export default function PRMetrics() {
  const [metrics, setMetrics] = useState<PRMetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchMetrics() {
    try {
      setLoading(true);

      const response = await fetch("/api/metrics/prs");

      if (!response.ok) {
        throw new Error("Failed to fetch PR metrics");
      }

      const data = await response.json();

      setMetrics(data);
      setError("");
    } catch {
      setError("Failed to load PR metrics");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMetrics();
  }, []);

  const chartData = metrics
    ? [
        { label: "Open", value: metrics.open },
        { label: "Merged", value: metrics.merged },
        { label: "Closed", value: metrics.closed },
      ]
    : [];

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">
        PR Analytics
      </h2>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-lg bg-[var(--card-muted)]"
            />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      ) : metrics ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-lg bg-[var(--control)] p-4 text-center">
              <div className="text-2xl font-bold">{metrics.open}</div>
              <div className="text-sm">Open</div>
            </div>

            <div className="rounded-lg bg-[var(--control)] p-4 text-center">
              <div className="text-2xl font-bold">{metrics.merged}</div>
              <div className="text-sm">Merged</div>
            </div>

            <div className="rounded-lg bg-[var(--control)] p-4 text-center">
              <div className="text-2xl font-bold">{metrics.closed}</div>
              <div className="text-sm">Closed</div>
            </div>

            <div className="rounded-lg bg-[var(--control)] p-4 text-center">
              <div className="text-2xl font-bold">
                {metrics.mergeRate}%
              </div>
              <div className="text-sm">Merge Rate</div>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />

                <Bar
                  dataKey="value"
                  fill="#3b82f6"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div>No data available</div>
      )}
    </div>
  );
}