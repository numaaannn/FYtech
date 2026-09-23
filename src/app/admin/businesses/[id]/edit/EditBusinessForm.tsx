"use client";
import React, { useState } from 'react';
import { LoaderCircle, X } from 'lucide-react';

export default function EditBusinessForm({ business }: { business: { id: number; name: string; ownerName: string } }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(business.name);
  const [ownerName, setOwnerName] = useState(business.ownerName);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/businesses/${business.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, ownerName }),
      });
      if (!res.ok) {
        alert('Failed to update business');
        return;
      }
      setOpen(false);
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Error updating business');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="primary-button"
      >
        Edit Business
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Edit Business</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="icon-button"
                aria-label="Close edit business dialog"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="business-name" className="text-sm font-medium">
                  Business Name
                </label>
                <input
                  id="business-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label htmlFor="business-owner" className="text-sm font-medium">
                  Owner Name
                </label>
                <input
                  id="business-owner"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  required
                  className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-cyan-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="secondary-button"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="primary-button disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading && <LoaderCircle size={15} className="animate-spin" />}{loading ? 'Saving...' : 'Save changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
