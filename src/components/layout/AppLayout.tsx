'use client';

import React, { useState } from 'react';
import AppHeader from './AppHeader';
import BottomNav from './BottomNav';
import { UserSession } from '@/lib/auth/session';
import { logoutAction } from '@/app/actions';
import { useRouter } from 'next/navigation';

export default function AppLayout({
  children,
  initialSession,
}: {
  children: React.ReactNode;
  initialSession: UserSession | null;
}) {
  const [session, setSession] = useState<UserSession | null>(initialSession);
  const router = useRouter();

  const handleLogout = async () => {
    if (confirm('Are you sure you want to log out?')) {
      const res = await logoutAction();
      if (res.success) {
        setSession(null);
        router.push('/login');
        router.refresh();
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 pb-20 sm:pb-24">
      <AppHeader session={session} onLogout={handleLogout} />
      <main className="flex-1 flex flex-col">{children}</main>
      <BottomNav />
    </div>
  );
}
