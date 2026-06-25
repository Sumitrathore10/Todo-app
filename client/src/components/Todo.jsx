import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ title: '', description: '' });

  const getTodos = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await api.get('/todo');
      setTodos(res.data.todos || []);
    } catch (error) {
      if (error.response?.status === 401) {
        setError('Please login to see your todos.');
        setTodos([]);
      } else {
        setError(error.response?.data?.message || 'Unable to load todos');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await api.post('/todo/todoCreation', formData);
      setFormData({ title: '', description: '' });
      getTodos();
    } catch (error) {
      setError(error.response?.data?.message || 'Could not create todo');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/todo/${id}`);
      setTodos((current) => current.filter((item) => item._id !== id));
    } catch (error) {
      setError(error.response?.data?.message || 'Could not delete todo');
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-300/20">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <span className="inline-flex rounded-full bg-sky-100 px-4 py-1 text-sm font-semibold text-sky-700">Dashboard</span>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">Beautiful responsive todo management</h1>
              <p className="text-slate-600">Create, track, and delete tasks with an intuitive responsive interface. Your todos look great on mobile, tablet, and desktop.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-3xl bg-slate-50 p-5 shadow-sm">
                <h2 className="text-sm uppercase tracking-[0.2em] text-slate-400">Total todos</h2>
                <p className="mt-3 text-3xl font-semibold text-slate-900">{todos.length}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5 shadow-sm">
                <h2 className="text-sm uppercase tracking-[0.2em] text-slate-400">Status</h2>
                <p className="mt-3 text-3xl font-semibold text-slate-900">{todos.length > 0 ? 'Active' : 'Empty'}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5 shadow-sm">
                <h2 className="text-sm uppercase tracking-[0.2em] text-slate-400">Action</h2>
                <p className="mt-3 text-3xl font-semibold text-slate-900">Fast edits</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-300/20">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Create a new task</h2>
                <p className="mt-2 text-slate-600">Add a task and it will appear instantly in your list below.</p>
              </div>
              <span className="rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700">Responsive ready</span>
            </div>

            {error && (
              <div className="mt-6 rounded-3xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}

            <form onSubmit={handleCreate} className="mt-6 grid gap-4">
              <input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Task title"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10"
                required
              />
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Task description"
                rows={5}
                className="w-full rounded-[1.75rem] border border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10"
                required
              />
              <button
                type="submit"
                className="inline-flex justify-center rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-500"
              >
                Add todo
              </button>
            </form>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-300/20">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Your tasks</h2>
                <p className="mt-2 text-slate-600">Review your list and delete tasks as needed.</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-600">Live</span>
            </div>

            {loading ? (
              <div className="mt-8 rounded-[1.75rem] bg-slate-50 p-6 text-center text-slate-700">Loading todos...</div>
            ) : todos.length === 0 ? (
              <div className="mt-8 rounded-[1.75rem] bg-slate-50 p-6 text-center text-slate-700">
                No todos yet. Use the form to add your first task.
              </div>
            ) : (
              <div className="mt-8 grid gap-4">
                {todos.map((item) => (
                  <article key={item._id} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
                        <p className="mt-2 text-slate-600">{item.description}</p>
                      </div>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-400"
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Todo;