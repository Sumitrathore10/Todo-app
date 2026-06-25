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
    <div className="min-h-screen bg-slate-50 px-4 py-12 text-slate-900">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-8 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-300/20">
        <div className="space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.24em] text-sky-700">Welcome back</p>
          <h1 className="text-4xl font-semibold text-slate-900">Sign in to your account</h1>
          <p className="text-slate-600">Access your tasks and keep your day organized with ease.</p>
        </div>

        {error && (
          <div className="rounded-3xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-4">
          <label className="space-y-2 text-sm text-slate-700">
            Email
            <input
              type="email"
              placeholder="you@example.com"
              value={data.email}
              className="w-full rounded-[1.5rem] border border-slate-200 bg-slate-100 px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10"
              onChange={(e) => setData({ ...data, email: e.target.value })}
              required
            />
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            Password
            <input
              type="password"
              placeholder="Enter your password"
              value={data.password}
              className="w-full rounded-[1.5rem] border border-slate-200 bg-slate-100 px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10"
              onChange={(e) => setData({ ...data, password: e.target.value })}
              required
            />
          </label>
          <button
            type="submit"
            className="mt-2 rounded-full bg-sky-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-sky-500"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <Link className="text-sky-700 font-semibold hover:text-sky-900" to="/register">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
