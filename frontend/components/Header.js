'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Header({ user }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('http://localhost:5000/api/auth/logout', { method: 'POST', credentials: 'include' });
    router.push('/login');
  };

  return (
    <header className="w-full bg-white shadow p-4 flex justify-between items-center">
      <Link href="/"><span className="text-lg font-bold">Auth Dashboard</span></Link>
      <nav>
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm">{user.name}</span>
            <button onClick={handleLogout} className="px-3 py-1 border rounded">Logout</button>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </div>
        )}
      </nav>
    </header>
  );
}
