"use client";

import { useEffect } from "react";

export function DemoInitializer() {
  useEffect(() => {
    fetch("/api/demo/seed", { method: "POST" }).catch(() => {});
  }, []);
  return null;
}
