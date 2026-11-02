import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const WORKER_URL =
  "https://portfolio-visitor-notifier.tiryakiemre18.workers.dev";

const SESSION_KEY = "portfolio-visit-notified";

export default function VisitorTracker() {
  const location = useLocation();

  useEffect(() => {
    if (!import.meta.env.PROD || location.pathname === "/json") {
      return;
    }

    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;

      // Aynı sekmede yalnızca bir bildirim gönder.
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      return;
    }

    fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        path: location.pathname,
      }),
      keepalive: true,
    }).catch(() => {
      // Bildirim hatası siteyi etkilemesin.
    });
  }, [location.pathname]);

  return null;
}
