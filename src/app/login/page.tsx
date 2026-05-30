'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Phone, User, ArrowRight, ShieldAlert } from 'lucide-react';
import { loginAction } from '@/app/actions';

export default function LoginPage() {
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }

    if (!mobileNumber.trim()) {
      setError('Please enter your mobile number.');
      return;
    }

    startTransition(async () => {
      const res = await loginAction(name, mobileNumber);
      if (res.success) {
        router.push('/map');
        router.refresh();
      } else {
        setError(res.error || 'Failed to sign in.');
      }
    });
  };

  return (
    <div className="relative flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12 text-slate-800 dark:text-slate-200">
      {/* Glow spots */}
      <div className="absolute top-1/4 left-1/4 h-[300px] w-[300px] rounded-full bg-amber-500/5 dark:bg-amber-500/5 blur-[90px]"></div>

      <div className="w-full max-w-md space-y-6 z-10">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 text-slate-950 shadow-lg shadow-amber-500/20">
            <Sparkles className="h-6 w-6 animate-pulse" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
            Join the Community
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enter your details to pin new locations and confirm details.
          </p>
        </div>

        {/* Card wrapper */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-900/10 p-6 backdrop-blur-sm shadow-sm dark:shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-950/20 p-3 text-xs font-bold text-red-650 dark:text-red-400">
                {error}
              </div>
            )}

            {/* Name Input */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Your Name / ඔබේ නම
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <User className="h-4 w-4" />
                </span>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Raveen"
                  className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 py-3 pl-10 pr-4 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Mobile Number Input */}
            <div className="space-y-1.5">
              <label htmlFor="phone" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Mobile Number / දුරකථන අංකය
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Phone className="h-4 w-4" />
                </span>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="e.g. 0771234567"
                  className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 py-3 pl-10 pr-4 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:border-amber-500 focus:outline-none"
                />
              </div>
              <p className="text-[10px] text-slate-500">
                Accepts: 07XXXXXXXX, +947XXXXXXXX, 947XXXXXXXX formats.
              </p>
            </div>

            {/* Info notice */}
            <div className="rounded-lg border border-amber-100 dark:border-slate-800 bg-amber-50 dark:bg-slate-950/40 p-3 text-[10px] text-slate-600 dark:text-slate-400 flex gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-550 dark:text-amber-500 shrink-0" />
              <span>
                Privacy Guarantee: Your mobile number is encrypted, stored securely, and is never displayed publicly or shared.
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3.5 text-sm font-bold text-slate-950 transition-all hover:scale-102 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 cursor-pointer"
            >
              <span>{isPending ? 'Signing In...' : 'Get Started / ඇතුල් වන්න'}</span>
              {!isPending && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
