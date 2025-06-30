import React from "react";
import { useState } from "react";
import axios from "axios";

const Signup = () => {
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/user/register",
        data,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        alert("Registration successful");
      }
    } catch (error) {
      alert(error.respone.data.message || "Something went wrong");
    }
  };
  return (
    <div className="w-full h-screen flex justify-center items-center ">
      <form className="w-[20%] h-[40%] p-4 border poppins  border-gray-400 rounded-md shadow-xs shadow-black">
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-3xl font-bold mb-4 poppins">Sign Up</h1>
          <input
            type="text"
            placeholder="Username"
            className="mb-2 p-2 border border-gray-300 rounded"
            required
            onChange={(e) => setData({ ...data, username: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            className="mb-2 p-2 border border-gray-300 rounded"
            required
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="mb-2 p-2 border border-gray-300 rounded"
            required
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handleSubmit}
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
