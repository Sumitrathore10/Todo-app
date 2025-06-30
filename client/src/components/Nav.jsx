import React from 'react'
import { Link , Routes ,Route } from 'react-router-dom'
import Signup from './Signup.jsx'
import Login from './Login.jsx'
import Todo from './Todo.jsx'

const Nav = () => {
  return (
    <>
      <nav className=' flex w-[70%] h-fit border-b border-black justify-between items-center p-4 '>
     <div className='text-4xl poppins font-bold'>
      TODO<span className='text-red-600'>.</span>
     </div>

     <ul>
      <Link to='/' className='inline-block border-1 hover:bg-black hover:text-white py-2 px-4 hover:border-none border-black text-md font-semibold cursor-pointer transition-all uppercase mx-2 select-none'>home</Link>
      <Link to='/register' className='inline-block border-1 hover:bg-black hover:text-white py-2 px-4 hover:border-none border-black text-md font-semibold cursor-pointer transition-all uppercase select-none'>sign up</Link>
      <Link to='/login' className='inline-block border-1 hover:bg-black hover:text-white py-2 px-4 hover:border-none border-black text-md font-semibold mx-2 cursor-pointer transition-all uppercase select-none'> sign in</Link>
     </ul>
    </nav>

    <Routes>
       <Route path='/' element={<Todo/>}/>
      <Route path='/register' element={<Signup />}/>
      <Route path='/login' element={<Login />}/>
    </Routes>
    </>
  )
}

export default Nav