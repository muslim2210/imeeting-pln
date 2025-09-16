// hooks/useHydratedStore.ts
"use client";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export function useHydratedStore() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // cek langsung
    if (useAuthStore.persist.hasHydrated()) {
      setHydrated(true);
    } else {
      // tunggu hydration selesai
      const unsub = useAuthStore.persist.onFinishHydration(() =>
        setHydrated(true)
      );
      return () => unsub();
    }
  }, []);

  return hydrated;
}
