import React from 'react'
import { Link, Routes, Route, useNavigate } from 'react-router-dom'
import Signup from './Signup.jsx'
import Login from './Login.jsx'
import Todo from './Todo.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const Nav = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading, logout } = useAuth();

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      alert('Logout successful');
      navigate('/login');
    } else {
      alert('Unable to logout');
    }
  };

  return (
    <>
      <nav className='sticky top-0 z-20 w-full border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xl'>
        <div className='mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6'>
          <div className='flex flex-col gap-1'>
            <div className='inline-flex items-center gap-2 rounded-3xl bg-gradient-to-r from-sky-500 via-cyan-500 to-indigo-500 px-4 py-2 text-lg font-semibold text-white shadow-xl shadow-slate-300/40'>
              TODO<span className='text-white'>.</span>
            </div>
            <p className='text-sm text-slate-500'>Responsive task manager</p>
          </div>

          <div className='flex flex-wrap items-center gap-2'>
            <Link to='/' className='rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-400 hover:bg-slate-100'>Home</Link>
            {!loading && !isAuthenticated && (
              <Link to='/register' className='rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-400 hover:bg-slate-100'>Sign Up</Link>
            )}
            {!loading && !isAuthenticated && (
              <Link to='/login' className='rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-400 hover:bg-slate-100'>Sign In</Link>
            )}
            {!loading && isAuthenticated && (
              <button
                type='button'
                onClick={handleLogout}
                className='rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-rose-400 hover:bg-slate-100'
              >
                Logout
              </button>
            )}
          </div>
        </div>
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