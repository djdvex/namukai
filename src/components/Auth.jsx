import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Mail, Lock, LogIn, UserPlus } from "lucide-react";

// Supabase inicializacija
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage("✅ Account created! Check your email for confirmation.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setMessage("✅ Logged in successfully!");
      }
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });
      if (error) throw error;
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="w-full max-w-md p-8 bg-gray-900 rounded-2xl shadow-xl border border-gray-700">
        <h2 className="text-3xl font-bold text-center mb-6">
          {isSignUp ? "Create an Account" : "Welcome Back"}
        </h2>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="flex items-center bg-gray-800 rounded-lg px-4 py-2">
            <Mail className="text-gray-400 w-5 h-5 mr-3" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent focus:outline-none w-full text-white"
              required
            />
          </div>

          <div className="flex items-center bg-gray-800 rounded-lg px-4 py-2">
            <Lock className="text-gray-400 w-5 h-5 mr-3" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent focus:outline-none w-full text-white"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-2 bg-green-500 hover:bg-green-600 rounded-lg font-semibold flex items-center justify-center gap-2"
          >
            {isSignUp ? (
              <>
                <UserPlus className="w-5 h-5" /> Sign Up
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" /> Log In
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-2 mt-3 bg-red-500 hover:bg-red-600 rounded-lg font-semibold"
          >
            Continue with Google
          </button>

          <p className="text-center mt-4 text-gray-400">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <span
              className="text-green-400 cursor-pointer hover:underline"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? "Log In" : "Sign Up"}
            </span>
          </p>
        </form>

        {message && (
          <p className="text-center mt-4 text-sm text-gray-300">{message}</p>
        )}
      </div>
    </div>
  );
};

export default Auth;
