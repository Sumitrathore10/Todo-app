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
        setData({
          username: "",
          email: "",
          password: "",
        });

        navigate("/login");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black px-4 py-12 text-white">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-8 rounded-2xl border border-gray-800 bg-gray-950 p-8 shadow-xl shadow-black/50">

        <div className="space-y-3 text-center">
          <span className="inline-flex rounded-lg bg-gray-800 px-4 py-1 text-sm font-semibold uppercase tracking-[0.24em] text-gray-300">
            Create account
          </span>

          <h1 className="text-4xl font-semibold text-white">
            Join the productivity flow
          </h1>

          <p className="text-gray-400">
            Sign up to start managing your projects and todos on any device.
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-900/50 bg-red-950/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-4">

          <input
            type="text"
            placeholder="Username"
            value={data.username}
            onChange={(e) =>
              setData({ ...data, username: e.target.value })
            }
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-gray-600"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={data.email}
            onChange={(e) =>
              setData({ ...data, email: e.target.value })
            }
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-gray-600"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={data.password}
            autoComplete="new-password"
            onChange={(e) =>
              setData({ ...data, password: e.target.value })
            }
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-gray-600"
            required
          />

          <button
            type="submit"
            className="rounded-lg bg-gray-800 border border-gray-700 py-3 text-white font-semibold hover:bg-gray-700 hover:border-gray-600"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-white hover:text-gray-300"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Signup;