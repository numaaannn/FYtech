import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-xl rounded-2xl border border-emerald-200 bg-white p-8 shadow-sm">
        <div className="mb-4 inline-flex rounded-full bg-emerald-100 p-3 text-emerald-700">
          <CheckCircle2 size={28} />
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Payment complete</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">Your subscription is active.</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Your {params.slug ? params.slug.toUpperCase() : 'product'} access has been confirmed and is now available in your workspace.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/app" className="primary-button">Open workspace</Link>
          <Link href="/" className="secondary-button">Back to home</Link>
        </div>
      </div>
    </main>
  );
}
