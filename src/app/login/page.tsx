import Link from 'next/link';
import LoginForm from './LoginForm';

export default function LoginPage() {
  return <main className="min-h-screen bg-slate-50 p-5 grid place-items-center"><section className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-7 shadow-sm"><div className="mb-7"><Link href="/" className="text-lg font-extrabold tracking-tight text-slate-900">FYtech</Link><h1 className="mt-5 text-2xl font-semibold tracking-tight text-slate-900">Sign in to FYtech</h1><p className="mt-2 text-sm text-slate-500">Access your business workspace or the administrator console.</p></div><LoginForm /><p className="mt-6 text-center text-sm text-slate-500">New to FYtech? <Link href="/signup" className="font-semibold text-teal-700 hover:text-teal-800">Create an account</Link></p></section></main>;
}
