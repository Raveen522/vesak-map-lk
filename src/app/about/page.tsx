import React from 'react';
import Link from 'next/link';
import { Sparkles, Heart, HelpCircle, ShieldCheck } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 space-y-8 text-slate-700 dark:text-slate-300">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">About Vesak Map LK</h1>
        <p className="text-xs text-amber-600 dark:text-amber-500 font-bold uppercase tracking-wider">
          Sri Lankan Community Initiative
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-900/10 p-6 space-y-4 leading-relaxed text-sm shadow-sm dark:shadow-none">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500 fill-red-500" />
          <span>Our Vision</span>
        </h2>
        <p>
          Vesak is a beautiful season of lights, lanterns, pandols (Thoran), and generosity (Dansal) in Sri Lanka. 
          However, finding where these events are situated can sometimes be challenging, as location lists are 
          scattered across different news feeds or social media posts.
        </p>
        <p>
          <strong>Vesak Map LK</strong> is a lightweight, mobile-first utility mapping application designed to consolidate all Vesak locations into a single, open dashboard. 
          This is a completely non-profit, free, community-moderated project built to run at no cost using OpenStreetMap coordinates.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-amber-400" />
          <span>Frequently Asked Questions</span>
        </h2>
        
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-900 shadow-sm dark:shadow-none">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">How does the trust system work?</h4>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              When a user pins a location, it starts with a status of <strong>New</strong>. Other community members can click <strong>Confirm</strong> or <strong>Report</strong>. 
              Confirmations made close to the location (within 500 meters) count as strong validations. If a pin receives multiple confirmations, it highlights as <strong>Highly Confirmed</strong>. 
              If it receives flags or reports, it becomes <strong>Disputed</strong> or gets hidden.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-900 shadow-sm dark:shadow-none">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Do I need an account to browse the map?</h4>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              No. Browsing the map, searching, and viewing details are completely public. You only need to register using your name and mobile number when you want to **add a new pin**, **confirm** an existing pin, or **report** errors.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-900 shadow-sm dark:shadow-none">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Why is there no SMS OTP code code verification?</h4>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              SMS gateways require paid subscription models. To keep this platform 100% free and open-source without displaying ads, we run a simplified registration process. We rely on community-based moderation and reporting signals to filter fake pins instead.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-900/10 p-5 text-xs text-slate-600 dark:text-slate-455 leading-relaxed space-y-2 shadow-sm dark:shadow-none">
        <h3 className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-amber-500" />
          <span>Disclaimers</span>
        </h3>
        <p>
          This website is provided as-is without any warranties. The pins are submitted by community members, and coordinate exactness, dates, or availability (specifically for food dansal) can vary. 
          Please check the trust details of the pin and plan accordingly.
        </p>
        <div className="pt-2 flex gap-4 text-slate-500 dark:text-slate-400">
          <Link href="/privacy" className="underline hover:text-slate-800 dark:hover:text-white">Privacy Policy</Link>
          <Link href="/terms" className="underline hover:text-slate-800 dark:hover:text-white">Terms of Service</Link>
        </div>
      </div>
    </div>
  );
}
