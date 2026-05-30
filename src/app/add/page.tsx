import React from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import AddPlaceForm from '@/components/places/AddPlaceForm';

export const dynamic = 'force-dynamic';

export default async function AddPage() {
  const session = await getSession();

  // If user is not logged in, redirect to login
  if (!session) {
    redirect('/login?redirect=/add');
  }

  return <AddPlaceForm />;
}
