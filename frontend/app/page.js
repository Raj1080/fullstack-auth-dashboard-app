import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-20 px-6 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />

        <h1 className="text-3xl font-bold mt-6 mb-4">Auth Dashboard — Demo</h1>

        <p className="max-w-md text-lg leading-7 text-zinc-600 dark:text-zinc-400 mb-6">
          This is a demo front-end for your Fullstack Auth Dashboard. Use the links below to register or login and open the protected dashboard.
        </p>

        <div className="flex gap-4">
          <Link href="/register" className="px-5 py-3 rounded bg-green-600 text-white font-medium">Register</Link>
          <Link href="/login" className="px-5 py-3 rounded border border-black">Login</Link>
        </div>

        <p className="mt-10 text-sm text-zinc-500">
          Frontend live: <a className="text-blue-600" href="https://frontend-nyvai40a7-rajs-projects-6a820c25.vercel.app" target="_blank" rel="noreferrer">Open deployed site</a>
        </p>
      </main>
    </div>
  );
}
