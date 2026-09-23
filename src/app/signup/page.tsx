import Link from 'next/link';
import SignupForm from './SignupForm';

export default function SignupPage() {
  return <main className="min-h-screen bg-slate-50 p-5 grid place-items-center"><section className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-7 shadow-sm"><div className="mb-7"><Link href="/" className="text-lg font-extrabold tracking-tight text-slate-900">FYtech</Link><h1 className="mt-5 text-2xl font-semibold tracking-tight text-slate-900">Create your FYtech account</h1><p className="mt-2 text-sm text-slate-500">Start with a workspace account and get connected to your business.</p></div><SignupForm /><p className="mt-6 text-center text-sm text-slate-500">Already have an account? <Link href="/login" className="font-semibold text-teal-700 hover:text-teal-800">Sign in</Link></p></section></main>;
}