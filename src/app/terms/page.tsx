import React from 'react';

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
      <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white text-center">Terms of Service</h1>
      <p className="text-[10px] text-slate-500 text-center uppercase tracking-wider">
        Last Updated: May 2026
      </p>

      <div className="space-y-4 bg-white dark:bg-slate-900/10 border border-slate-200 dark:border-slate-900 p-6 rounded-2xl shadow-sm dark:shadow-none">
        <p>
          Welcome to <strong>Vesak Map LK</strong>. By accessing or submitting data on our platform, you agree to comply with these terms.
        </p>

        <h3 className="font-bold text-slate-900 dark:text-white mt-4 text-base">1. Community-Generated Data</h3>
        <p>
          All locations, dates, and notes on this platform are submitted by public users. 
          Vesak Map LK does not verify coordinates, safety, or foods provided by dansal. 
          Use this website at your own risk.
        </p>

        <h3 className="font-bold text-slate-900 dark:text-white mt-4 text-base">2. Acceptable Conduct</h3>
        <p>
          You agree to add only real, Vesak-related displays (Thoran, Lanterns, or Dansal). 
          Submitting spam pins, fake coordinates, advertisements, offensive language, or phone numbers in titles is strictly prohibited. 
          The community has mechanisms to flag and automatically hide incorrect data.
        </p>

        <h3 className="font-bold text-slate-900 dark:text-white mt-4 text-base">3. Non-Commercial Use</h3>
        <p>
          This is a free community utility built for the general public during the Vesak season. 
          Any automated scraping of pins or commercial use of our endpoints is prohibited.
        </p>

        <h3 className="font-bold text-slate-900 dark:text-white mt-4 text-base">4. Liability</h3>
        <p>
          Under no circumstances shall the creators, maintainers, or hosting partners of this website be liable for any direct or indirect damages, traffic fines, travel delays, or food poisoning related to your visits to community-pinned locations.
        </p>
      </div>
    </div>
  );
}
