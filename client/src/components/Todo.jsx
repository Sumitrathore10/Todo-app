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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black px-4 py-10 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <section className="rounded-xl border border-gray-800 bg-gray-950/50 p-8 shadow-xl shadow-black/50">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <span className="inline-flex rounded-lg bg-gray-800 px-4 py-1 text-sm font-semibold text-gray-300">Dashboard</span>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Beautiful responsive todo management</h1>
              <p className="text-gray-400">Create, track, and delete tasks with an intuitive responsive interface. Your todos look great on mobile, tablet, and desktop.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-5 shadow-sm">
                <h2 className="text-sm uppercase tracking-[0.2em] text-gray-500">Total todos</h2>
                <p className="mt-3 text-3xl font-semibold text-white">{todos.length}</p>
              </div>
              <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-5 shadow-sm">
                <h2 className="text-sm uppercase tracking-[0.2em] text-gray-500">Status</h2>
                <p className="mt-3 text-3xl font-semibold text-white">{todos.length > 0 ? 'Active' : 'Empty'}</p>
              </div>
              <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-5 shadow-sm">
                <h2 className="text-sm uppercase tracking-[0.2em] text-gray-500">Action</h2>
                <p className="mt-3 text-3xl font-semibold text-white">Fast edits</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <div className="rounded-xl border border-gray-800 bg-gray-950/50 p-8 shadow-xl shadow-black/50">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-white">Create a new task</h2>
                <p className="mt-2 text-gray-400">Add a task and it will appear instantly in your list below.</p>
              </div>
              <span className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-semibold text-gray-300">Responsive ready</span>
            </div>

            {error && (
              <div className="mt-6 rounded-lg border border-red-900/50 bg-red-950/20 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleCreate} className="mt-6 grid gap-4">
              <input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Task title"
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-4 text-white outline-none placeholder:text-gray-600 focus:border-gray-600 focus:ring-2 focus:ring-gray-700/50"
                required
              />
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Task description"
                rows={5}
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-4 text-white outline-none placeholder:text-gray-600 focus:border-gray-600 focus:ring-2 focus:ring-gray-700/50"
                required
              />
              <button
                type="submit"
                className="inline-flex justify-center rounded-lg border border-gray-700 bg-gray-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-700 hover:border-gray-600"
              >
                Add todo
              </button>
            </form>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-950/50 p-8 shadow-xl shadow-black/50">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-white">Your tasks</h2>
                <p className="mt-2 text-gray-400">Review your list and delete tasks as needed.</p>
              </div>
              <span className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-300">Live</span>
            </div>

            {loading ? (
              <div className="mt-8 rounded-lg border border-gray-800 bg-gray-900/50 p-6 text-center text-gray-400">Loading todos...</div>
            ) : todos.length === 0 ? (
              <div className="mt-8 rounded-lg border border-gray-800 bg-gray-900/50 p-6 text-center text-gray-400">
                No todos yet. Use the form to add your first task.
              </div>
            ) : (
              <div className="mt-8 grid gap-4">
                {todos.map((item) => (
                  <article key={item._id} className="rounded-lg border border-gray-800 bg-gray-900/50 p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                        <p className="mt-2 text-gray-400">{item.description}</p>
                      </div>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-950/50 hover:border-red-800"
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