import { useEffect, useState } from "react";
import BASEURL from "./Base";

export default function useAutoRefresh() {
  const [, setTick] = useState(0); // just to force re-render

  const refreshToken = async () => {
    try {
      const res = await fetch(`${BASEURL}api/refresh/`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        setTick((t) => t + 1); // force a re-render
      } else {
        console.log("Token refresh failed");
      }
    } catch (err) {
      console.log("Refresh error:", err);
    }
  };

  useEffect(() => {
    // refresh on load
    refreshToken();

    // refresh every 4 min
    const interval = setInterval(refreshToken, 4 * 60 * 1000);

    // refresh on tab focus
    const onFocus = () => refreshToken();
    window.addEventListener("focus", onFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, []);
}
