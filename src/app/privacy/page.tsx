import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
      <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white text-center">Privacy Policy</h1>
      <p className="text-[10px] text-slate-500 text-center uppercase tracking-wider">
        Last Updated: May 2026
      </p>

      <div className="space-y-4 bg-white dark:bg-slate-900/10 border border-slate-200 dark:border-slate-900 p-6 rounded-2xl shadow-sm dark:shadow-none">
        <p>
          At <strong>Vesak Map LK</strong>, we prioritize the protection of your privacy. 
          As a community utility, we aim to collect only the absolute minimum information necessary to secure the platform from duplicate spam pins.
        </p>

        <h3 className="font-bold text-slate-900 dark:text-white mt-4 text-base">1. Information We Collect</h3>
        <p>
          When registering to submit pins or confirmations, we collect:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-xs text-slate-650 dark:text-slate-400">
          <li><strong>Your Name:</strong> Used to display on the profile dashboard.</li>
          <li><strong>Your Mobile Number:</strong> Used solely to identify distinct accounts and enforce submission rate-limits. We normalize and store this number securely.</li>
        </ul>

        <h3 className="font-bold text-slate-900 dark:text-white mt-4 text-base">2. Mobile Number Confidentiality</h3>
        <p className="text-amber-600 dark:text-amber-400 font-semibold">
          Your mobile number is private. It is never displayed publicly on the map, list, or place details, and is not shared with any third party.
        </p>

        <h3 className="font-bold text-slate-900 dark:text-white mt-4 text-base">3. Location Data</h3>
        <p>
          When you click "Use GPS Location" or confirm a pin, the application uses your browser coordinates to calculate your distance from the pin. 
          This data is processed locally in the browser to calculate distance and is not stored permanently as your personal tracking profile.
        </p>

        <h3 className="font-bold text-slate-900 dark:text-white mt-4 text-base">4. Contact</h3>
        <p>
          Since this is a free community-supported project, you can review our open repository code to inspect how database security and RLS are handled.
        </p>
      </div>
    </div>
  );
}
