import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import BASEURL from "./Base";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch(`${BASEURL}api/refresh/`, {
          method: "POST",
          credentials: "include",
        });

        if (res.ok) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      } catch (err) {
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  if (loading) return <div>Loading...</div>; 

  return authenticated ? children : <Navigate to="/" replace />;
}
