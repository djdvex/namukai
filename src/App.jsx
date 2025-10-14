import React, { useState, useEffect } from "react";
import Auth from "./components/Auth.jsx";
import Chat from "./components/Chat.jsx";
import Plans from "./components/Plans.jsx";
import { createClient } from "@supabase/supabase-js";
import "./app.css";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnon =
  import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnon);

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then((r) => {
      if (r.data?.session) setUser(r.data.session.user);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );
    return () => listener?.subscription?.unsubscribe?.();
  }, []);

  return (
    <div className="app-root">
      {/* HEADER */}
      <header className="header">
        <div className="logo">
          <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
            DI
          </div>
          <span>Namams</span>
        </div>
        <div className="tag">DI jūsų kasdienybei</div>
      </header>

      {/* MAIN */}
      <main className="main">
        {!user ? (
          <Auth supabase={supabase} />
        ) : (
          <>
            <Plans supabase={supabase} user={user} />
            <Chat supabase={supabase} user={user} />
          </>
        )}
      </main>

      {/* FOOTER */}
      <footer className="footer">© 2025 DI Namams — Powered by OpenAI</footer>
    </div>
  );
}
