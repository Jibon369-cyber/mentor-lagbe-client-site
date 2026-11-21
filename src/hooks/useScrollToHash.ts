"use client";

import { useEffect } from "react";

export function useScrollToHash(ready: boolean) {
  useEffect(() => {
    if (!ready) return;

    function scrollToTarget() {
      const targetId = window.location.hash.slice(1);
      if (targetId) {
        document
          .getElementById(targetId)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }

    const frame = window.requestAnimationFrame(scrollToTarget);
    window.addEventListener("hashchange", scrollToTarget);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", scrollToTarget);
    };
  }, [ready]);
}
