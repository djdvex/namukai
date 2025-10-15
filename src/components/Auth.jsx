import React, { useState } from "react";
import { LogIn, UserPlus } from "lucide-react";

const Auth = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please fill in all fields.");
      return;
    }
    onAuthSuccess();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isLogin ? "Welcome back" : "Create an account"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200 outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200 outline-none"
          />
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {isLogin ? (
              <>
                <LogIn size={18} /> Login
              </>
            ) : (
              <>
                <UserPlus size={18} /> Sign Up
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600">
          {isLogin ? "No account?" : "Already have one?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:underline"
          >
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
