import SetupForm from './SetupForm';

export default function SetupPage() {
  return <main className="min-h-screen bg-slate-50 p-5 grid place-items-center"><section className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-7 shadow-sm"><div className="mb-7"><div className="text-lg font-extrabold tracking-tight text-slate-900">FYtech</div><h1 className="mt-5 text-2xl font-semibold tracking-tight text-slate-900">Create the administrator account</h1><p className="mt-2 text-sm text-slate-500">This page only works until the first admin account is created.</p></div><SetupForm /></section></main>;
}
