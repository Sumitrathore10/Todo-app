import axios from 'axios'
import React, { useEffect, useState } from 'react'


const Todo = () => {
  const [todo, setTodo] = useState([])

  const getTodos = async () =>{
    try {
      const res = await axios.get('http://localhost:5000/api/v1/todo',{
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      })
      setTodo(res.data.todos)
    } catch (error) {
      alert(error.response.data.message || "Something went wrong")
    }
  }
  useEffect(()=>{
    getTodos()
  })
  return (
    <div className='w-full h-screen flex px-[15%]  gap-3 p-4'>
      {todo.map((item,) => (
        <div key={item._id} className='w-[30%] h-[30%] flex flex-col items-center border border-gray-400 rounded-md shadow-xs shadow-black p-4'>
        <h1 className='text-3xl font-bold poppins'>{item.title}</h1>
        <p className='text-gray-500 mt-4 poppins'>{item.description}</p>
      </div>
      ))}
    </div>
  )
}

export default Todo