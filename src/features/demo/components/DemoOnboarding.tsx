"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { DemoSeedOverlay } from "./DemoSeedOverlay";

type DemoState = "idle" | "seeding" | "completing" | "ready" | "cleared";

export function DemoOnboarding({
  initialState,
}: {
  initialState: "needs_seed" | "seeded" | "none";
}) {
  const router = useRouter();
  const [state, setState] = useState<DemoState>(
    initialState === "needs_seed" ? "seeding" :
    initialState === "seeded"     ? "ready"   : "idle"
  );
  const [clearing, setClearing] = useState(false);
  const overlayCompleteRef = useRef<(() => void) | null>(null);

  // Fire seed + poll for completion
  useEffect(() => {
    if (state !== "seeding") return;

    let stopped = false;
    let pollInterval: ReturnType<typeof setInterval> | null = null;

    fetch("/api/demo/seed", { method: "POST" }).catch(() => {});

    pollInterval = setInterval(async () => {
      if (stopped) return;
      try {
        const res = await fetch("/api/demo/status");
        const data = await res.json();
        if (data.cleared) {
          clearInterval(pollInterval!);
          stopped = true;
          setState("idle");
          return;
        }
        if (data.seeded) {
          clearInterval(pollInterval!);
          stopped = true;
          setState("completing");
          overlayCompleteRef.current?.();
        }
      } catch {}
    }, 2500);

    return () => {
      stopped = true;
      if (pollInterval) clearInterval(pollInterval);
    };
  }, []);

  function handleClear() {
    setClearing(true);
    fetch("/api/demo/clear", { method: "DELETE" }).catch(() => {});
    window.location.href = "/dashboard";
  }

  if (state === "idle" || state === "cleared") return null;

  if (state === "seeding" || state === "completing") {
    return (
      <DemoSeedOverlay
        onComplete={() => router.refresh()}
        onReadyToComplete={(fn) => { overlayCompleteRef.current = fn; }}
      />
    );
  }

  // state === "ready"
  return (
    <div className="mb-6 flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50 px-5 py-3 text-sm">
      <div className="flex items-center gap-2 text-blue-700">
        <span>✦</span>
        <span>You&apos;re exploring Marketiqo with demo data. Ready to switch to your real workspace?</span>
      </div>
      <button
        onClick={handleClear}
        disabled={clearing}
        className="rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-blue-700 hover:bg-blue-100 transition-colors disabled:opacity-50"
      >
        {clearing ? "Clearing…" : "Clear demo data & get started"}
      </button>
    </div>
  );
}
