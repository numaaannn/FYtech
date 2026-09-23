import Link from 'next/link';
import { XCircle } from 'lucide-react';

export default async function CheckoutCancelPage({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-xl rounded-2xl border border-amber-200 bg-white p-8 shadow-sm">
        <div className="mb-4 inline-flex rounded-full bg-amber-100 p-3 text-amber-700">
          <XCircle size={28} />
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">Payment cancelled</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">Checkout was not completed.</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          No charge was made. You can try again any time for {params.slug ? params.slug.toUpperCase() : 'this product'}.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={params.slug ? `/products/${params.slug}` : '/#products'} className="primary-button">Try again</Link>
          <Link href="/" className="secondary-button">Back to home</Link>
        </div>
      </div>
    </main>
  );
}
