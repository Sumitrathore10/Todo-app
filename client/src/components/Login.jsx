import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const { setIsAuthenticated } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/user/login", data);
      if (res.data.success) {
        setIsAuthenticated(true);
        alert("Login successful");
        navigate("/");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black px-4 py-12 text-white">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-8 rounded-2xl border border-gray-800 bg-gray-950 p-8 shadow-xl shadow-black/50">
        <div className="space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.24em] text-gray-500">Welcome back</p>
          <h1 className="text-4xl font-semibold text-white">Sign in to your account</h1>
          <p className="text-gray-400">Access your tasks and keep your day organized with ease.</p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-900/50 bg-red-950/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-4">
          <label className="space-y-2 text-sm text-gray-300">
            Email
            <input
              type="email"
              placeholder="you@example.com"
              value={data.email}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-gray-600 focus:ring-2 focus:ring-gray-700/50"
              onChange={(e) => setData({ ...data, email: e.target.value })}
              required
            />
          </label>
          <label className="space-y-2 text-sm text-gray-300">
            Password
            <input
              type="password"
              placeholder="Enter your password"
              value={data.password}
              autoComplete="current-password"
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-gray-600 focus:ring-2 focus:ring-gray-700/50"
              onChange={(e) => setData({ ...data, password: e.target.value })}
              required
            />
          </label>
          <button
            type="submit"
            className="mt-2 rounded-lg bg-gray-800 border border-gray-700 px-6 py-3 text-base font-semibold text-white transition hover:bg-gray-700 hover:border-gray-600"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-400">
          Don&apos;t have an account?{' '}
          <Link className="text-white font-semibold hover:text-gray-300" to="/register">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
