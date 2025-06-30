import axios from "axios";
import React, { useState } from "react";

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const  res = await axios.post('http://localhost:5000/api/v1/user/login',data,{
        headers:{
          "Content-Type": "application/json"
        },
        withCredentials:true
        
      })
      if(res.data.success){
          alert("Login successful");
        }
    } catch (error) {
      alert(error.response.data.message || "Something went wrong");
    }
  }
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <form className="w-[20%] h-[40%] p-4 border poppins flex flex-col justify-center items-center select-none border-gray-400 rounded-md shadow-xs shadow-black">
        <h1 className="text-3xl font-bold mb-6 poppins">Login</h1>
        <input
          type="email"
          placeholder="email"
          className="mb-2 p-2 border border-gray-300 rounded"
          onChange={(e)=> setData({...data, email:e.target.value})}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="mb-2 p-2 border border-gray-300 rounded"
          onChange={(e)=> setData({...data, password:e.target.value})}
          required
        />
        <button
          onClick={handleSubmit}
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
