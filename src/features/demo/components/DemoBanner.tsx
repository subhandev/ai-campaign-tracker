"use client";

import { useEffect, useState } from "react";

export function DemoBanner() {
  const [demoWorkspaceExists, setDemoWorkspaceExists] = useState<boolean | null>(null);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    fetch("/api/demo/status")
      .then((r) => r.json())
      .then((d) => setDemoWorkspaceExists(d.hasDemoWorkspace ?? false))
      .catch(() => setDemoWorkspaceExists(false));
  }, []);

  async function handleClear() {
    setClearing(true);
    await fetch("/api/demo/clear", { method: "DELETE" });
    window.location.href = "/clients/new";
  }

  if (demoWorkspaceExists !== true) return null;

  return (
    <div className="mb-6 flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50 px-5 py-3 text-sm">
      <div className="flex items-center gap-2 text-blue-700">
        <span>✦</span>
        <span>
          You&apos;re exploring Marketiqo with demo data. Create your first real client to get
          started.
        </span>
      </div>
      <div className="flex items-center gap-3">
        <a
          href="/clients/new"
          className="font-medium text-blue-700 underline underline-offset-2 hover:text-blue-900 transition-colors"
        >
          Create first client →
        </a>
        <button
          onClick={handleClear}
          disabled={clearing}
          className="rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-blue-700 hover:bg-blue-100 transition-colors disabled:opacity-50"
        >
          {clearing ? "Clearing…" : "Clear demo data"}
        </button>
      </div>
    </div>
  );
}
