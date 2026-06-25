import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

const Signup = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/user/register", data);
      if (res.data.success) {
        alert("Registration successful");
        setData({ username: "", email: "", password: "" });
        navigate("/login");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12 text-slate-900">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-8 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-300/20">
        <div className="space-y-3 text-center">
          <span className="inline-flex rounded-full bg-sky-100 px-4 py-1 text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">Create account</span>
          <h1 className="text-4xl font-semibold text-slate-900">Join the productivity flow</h1>
          <p className="text-slate-600">Sign up to start managing your projects and todos on any device.</p>
        </div>

        {error && (
          <div className="rounded-3xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-4">
          <label className="space-y-2 text-sm text-slate-700">
            Username
            <input
              type="text"
              placeholder="Your name"
              value={data.username}
              onChange={(e) => setData({ ...data, username: e.target.value })}
              className="w-full rounded-[1.5rem] border border-slate-200 bg-slate-100 px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10"
              required
            />
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            Email address
            <input
              type="email"
              placeholder="you@example.com"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              className="w-full rounded-[1.5rem] border border-slate-200 bg-slate-100 px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10"
              required
            />
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            Password
            <input
              type="password"
              placeholder="Choose a password"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              className="w-full rounded-[1.5rem] border border-slate-200 bg-slate-100 px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10"
              required
            />
          </label>

          <button
            type="submit"
            className="mt-2 rounded-full bg-sky-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-sky-500"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link className="text-sky-700 font-semibold hover:text-sky-900" to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;