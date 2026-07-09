import React, { useState } from "react";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import Signup from "./Signup.jsx";
import Login from "./Login.jsx";
import Todo from "./Todo.jsx";
import Footer from "./Footer.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Nav = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      alert("Logout successful");
      setMobileMenuOpen(false);
      navigate("/");
    } else {
      alert("Unable to logout");
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black shadow-lg backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link to="/" className="group flex items-center gap-2 lg:gap-3">
              {/* Logo Icon */}
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-700 bg-gradient-to-br from-gray-800 to-black shadow-lg transition-transform group-hover:scale-110 sm:h-12 sm:w-12">
                <svg className="h-6 w-6 text-white sm:h-7 sm:w-7" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              
              {/* Logo Text */}
              <div className="flex flex-col gap-0.5">
                <div className="text-lg font-bold text-white sm:text-xl lg:text-2xl">
                  TODO<span className="text-gray-500">.</span>
                </div>
                <p className="hidden text-xs font-medium text-gray-600 sm:block">Task Manager</p>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/"
              className="rounded-lg border border-gray-700 bg-gray-900/50 px-4 py-2 text-sm font-semibold text-gray-300 transition hover:bg-gray-800 hover:border-gray-600"
            >
              Home
            </Link>
            {!loading && !isAuthenticated && (
              <>
                <Link
                  to="/register"
                  className="rounded-lg border border-gray-700 bg-gray-900/50 px-4 py-2 text-sm font-semibold text-gray-300 transition hover:bg-gray-800 hover:border-gray-600"
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="rounded-lg border border-gray-700 bg-gray-900/50 px-4 py-2 text-sm font-semibold text-gray-300 transition hover:bg-gray-800 hover:border-gray-600"
                >
                  Sign In
                </Link>
              </>
            )}
            {!loading && isAuthenticated && (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-950/50 hover:border-red-800"
              >
                Logout
              </button>
            )}
          </div>

          {/* Hamburger Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <span className={`h-0.5 w-6 bg-gray-400 transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}></span>
            <span className={`h-0.5 w-6 bg-gray-400 transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : ""}`}></span>
            <span className={`h-0.5 w-6 bg-gray-400 transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800 bg-gray-950 px-4 py-4">
            <div className="flex flex-col gap-3">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-sm font-semibold text-gray-300 transition hover:bg-gray-800 hover:border-gray-600"
              >
                Home
              </Link>
              {!loading && !isAuthenticated && (
                <>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-sm font-semibold text-gray-300 transition hover:bg-gray-800 hover:border-gray-600"
                  >
                    Sign Up
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-sm font-semibold text-gray-300 transition hover:bg-gray-800 hover:border-gray-600"
                  >
                    Sign In
                  </Link>
                </>
              )}
              {!loading && isAuthenticated && (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-950/50"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Todo />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>

      <Footer />
    </>
  );
};

export default Nav;
