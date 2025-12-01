"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");

  useEffect(() => {
    (async () => {
      try {
        // fetch profile
        const meRes = await fetch(`${API}/api/auth/me`, {
          method: "GET",
          credentials: "include",
        });
        if (!meRes.ok) throw new Error("Not authenticated");
        const me = await meRes.json();
        setUser(me.user);

        // fetch tasks
        const tRes = await fetch(`${API}/api/tasks`, {
          method: "GET",
          credentials: "include",
        });
        if (tRes.ok) {
          const tjson = await tRes.json();
          setTasks(tjson.tasks || []);
        }
      } catch (err) {
        // not authenticated -> go to login
        router.push("/login");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const createTask = async (e) => {
    e.preventDefault();
    if (!title) return;
    const res = await fetch(`${API}/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ title, description: "" }),
    });
    if (res.ok) {
      const data = await res.json();
      setTasks((prev) => [data.task, ...prev]);
      setTitle("");
    } else {
      alert("Failed to create task");
    }
  };

  const toggle = async (id, completed) => {
    const res = await fetch(`${API}/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ completed: !completed }),
    });
    if (res.ok) {
      const data = await res.json();
      setTasks((prev) => prev.map((t) => (t._id === id ? data.task : t)));
    }
  };

  const remove = async (id) => {
    const res = await fetch(`${API}/api/tasks/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) setTasks((prev) => prev.filter((t) => t._id !== id));
  };

  const handleLogout = async () => {
    await fetch(`${API}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    router.push("/login");
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <div className="text-lg font-bold">Auth Dashboard</div>
        <div className="flex items-center gap-4">
          {user && <div className="text-sm">{user.name}</div>}
          <button onClick={handleLogout} className="px-3 py-1 border rounded text-sm">
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Welcome, {user?.name}</h1>

        <form onSubmit={createTask} className="mb-4 flex gap-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="New task title"
            className="flex-1 p-2 border rounded"
          />
          <button className="px-4 py-2 bg-black text-white rounded">Add</button>
        </form>

        <ul className="space-y-3">
          {tasks.length === 0 && <li className="text-zinc-500">No tasks yet</li>}
          {tasks.map((t) => (
            <li key={t._id} className="p-3 border rounded flex justify-between items-center">
              <div>
                <div className={t.completed ? "line-through" : ""}>{t.title}</div>
                <div className="text-sm text-zinc-500">{new Date(t.createdAt).toLocaleString()}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => toggle(t._id, t.completed)} className="px-2 py-1 border rounded text-sm">
                  {t.completed ? "Undo" : "Done"}
                </button>
                <button onClick={() => remove(t._id)} className="px-2 py-1 border rounded text-sm">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
