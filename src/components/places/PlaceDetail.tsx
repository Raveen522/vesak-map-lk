'use client';

import React, { useState } from 'react';
import { 
  Navigation, 
  ThumbsUp, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  MapPin, 
  UserCheck, 
  Check, 
  X,
  Share2
} from 'lucide-react';
import { UserSession } from '@/lib/auth/session';

interface PlaceDetailProps {
  place: any;
  userLocation: [number, number] | null;
  session: UserSession | null;
  onClose: () => void;
  onConfirm: (placeId: string, type: string) => Promise<any>;
  onReport: (placeId: string, reason: string, note: string) => Promise<any>;
  onDelete?: (placeId: string) => Promise<any>;
}

export default function PlaceDetail({
  place,
  userLocation,
  session,
  onClose,
  onConfirm,
  onReport,
  onDelete,
}: PlaceDetailProps) {
  const [showConfirmOptions, setShowConfirmOptions] = useState(false);
  const [showReportOptions, setShowReportOptions] = useState(false);
  const [reportReason, setReportReason] = useState('wrong_location');
  const [reportNote, setReportNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!place) return null;

  const getCategoryLabel = (cat: string) => {
    if (cat === 'thorana') return 'Vesak Thorana / වෙසක් තොරණ';
    if (cat === 'lantern') return 'Vesak Koodu / Lanterns / වෙසක් කූඩු';
    return 'Dansala / දන්සල්';
  };

  const getCategoryColor = (cat: string) => {
    if (cat === 'thorana') return 'text-orange-500 dark:text-orange-400';
    if (cat === 'lantern') return 'text-purple-650 dark:text-purple-400';
    return 'text-emerald-600 dark:text-emerald-400';
  };

  const getTrustBadgeStyle = (status: string) => {
    switch (status) {
      case 'highly_confirmed':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-250 dark:border-amber-500/20';
      case 'community_confirmed':
        return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-250 dark:border-yellow-500/20';
      case 'disputed':
        return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20';
      case 'likely_wrong':
        return 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700';
      default:
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20';
    }
  };

  const getTrustText = (status: string) => {
    switch (status) {
      case 'highly_confirmed': return 'Highly Confirmed / විශ්වාසදායකයි';
      case 'community_confirmed': return 'Confirmed / තහවුරු කර ඇත';
      case 'disputed': return 'Disputed / මතභේදාත්මකයි';
      case 'likely_wrong': return 'Likely Wrong / වැරදි විය හැක';
      case 'new': return 'New / අලුත්';
      default: return status;
    }
  };

  const getTrustPercentage = () => {
    const strong = place.strong_confirm_count || 0;
    const weak = place.weak_confirm_count || 0;
    const reports = place.report_count || 0;
    const totalWeight = (strong * 10) + (weak * 5) + (reports * 20);
    if (totalWeight === 0) return null; // No votes yet
    const positiveWeight = (strong * 10) + (weak * 5);
    return Math.round((positiveWeight / totalWeight) * 100);
  };

  const fallbackCopyToClipboard = (text: string) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (successful) {
        alert('Share link copied to clipboard!');
      } else {
        alert('Could not copy link automatically. Please copy it manually:\n' + text);
      }
    } catch (err) {
      alert('Could not copy link automatically. Please copy it manually:\n' + text);
    }
  };

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => alert('Share link copied to clipboard!'))
        .catch(() => fallbackCopyToClipboard(text));
    } else {
      fallbackCopyToClipboard(text);
    }
  };

  const handleShare = () => {
    const shareText = `I found this Vesak location on Vesak Map LK: ${place.title}\n${window.location.origin}/place/${place.id}`;
    if (navigator.share) {
      navigator.share({
        title: place.title,
        text: `Vesak Map LK: ${place.title}`,
        url: `${window.location.origin}/place/${place.id}`,
      }).catch(() => {
        copyToClipboard(shareText);
      });
    } else {
      copyToClipboard(shareText);
    }
  };

  const handleConfirmSubmit = async (type: string) => {
    if (!session) {
      alert('Please log in first to confirm locations.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await onConfirm(place.id, type);
      if (res && res.success) {
        setShowConfirmOptions(false);
        alert('Thank you for confirming!');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      alert('Please log in first to report locations.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await onReport(place.id, reportReason, reportNote);
      if (res && res.success) {
        setShowReportOptions(false);
        setReportNote('');
        alert('Report submitted successfully. Community moderators will evaluate.');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`;

  return (
    <div className="flex h-full flex-col bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 p-4">
        <div>
          <span className={`text-[10px] font-bold tracking-wider uppercase ${getCategoryColor(place.category)}`}>
            {getCategoryLabel(place.category)}
          </span>
          <h2 className="mt-1 text-lg font-extrabold text-slate-900 dark:text-white">{place.title}</h2>
          {place.area_name && (
            <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-555 dark:text-slate-400">
              <MapPin className="h-3.5 w-3.5" />
              <span>{place.area_name}</span>
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {/* Trust Badge & Progress Gauge */}
        <div className="flex flex-col gap-2 rounded-xl bg-slate-50 dark:bg-slate-900/40 p-3 border border-slate-200 dark:border-slate-900">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Community Trust Score</span>
              <span className="mt-1 text-xs font-semibold text-slate-700 dark:text-slate-200">
                {place.strong_confirm_count} strong • {place.weak_confirm_count} weak confirmations
              </span>
            </div>
            <span className={`rounded-lg border px-2.5 py-1 text-xs font-bold ${getTrustBadgeStyle(place.trust_status)}`}>
              {getTrustText(place.trust_status)}
            </span>
          </div>
          
          {/* Progress bar representing trust percentage */}
          {(() => {
            const pct = getTrustPercentage();
            if (pct === null) {
              return (
                <div className="text-[10px] text-slate-500 italic mt-1">
                  No community confirmations yet.
                </div>
              );
            }
            const barColor = pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-500';
            const textColor = pct >= 80 ? 'text-emerald-600 dark:text-emerald-400' : pct >= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-red-650 dark:text-red-400';
            return (
              <div className="mt-1 space-y-1">
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-slate-500 dark:text-slate-400">Confidence Level</span>
                  <span className={textColor}>{pct}% Confirmed</span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full ${barColor} transition-all duration-500`} style={{ width: `${pct}%` }}></div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Description */}
        {place.description && (
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-455 dark:text-slate-400 uppercase">Description / විස්තරය</span>
            <p className="text-sm leading-relaxed text-slate-650 dark:text-slate-350">{place.description}</p>
          </div>
        )}

        {/* Address */}
        {place.address_text && (
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-455 dark:text-slate-400 uppercase">Address / ලිපිනය</span>
            <p className="text-sm text-slate-700 dark:text-slate-300">{place.address_text}</p>
          </div>
        )}

        {/* Dates & Times */}
        <div className="grid grid-cols-2 gap-3">
          {(place.start_date || place.end_date) && (
            <div className="flex items-start gap-2 rounded-xl bg-slate-50 dark:bg-slate-900/20 p-2.5 border border-slate-200 dark:border-slate-900">
              <Calendar className="mt-0.5 h-4 w-4 text-amber-550 dark:text-amber-500" />
              <div>
                <span className="block text-[9px] text-slate-550 dark:text-slate-400 font-bold uppercase">Dates</span>
                <span className="text-xs text-slate-700 dark:text-slate-200 font-medium">
                  {place.start_date || 'N/A'} to {place.end_date || 'N/A'}
                </span>
              </div>
            </div>
          )}
          {place.time_text && (
            <div className="flex items-start gap-2 rounded-xl bg-slate-50 dark:bg-slate-900/20 p-2.5 border border-slate-200 dark:border-slate-900">
              <Clock className="mt-0.5 h-4 w-4 text-amber-550 dark:text-amber-500" />
              <div>
                <span className="block text-[9px] text-slate-550 dark:text-slate-400 font-bold uppercase">Time</span>
                <span className="text-xs text-slate-700 dark:text-slate-200 font-medium">{place.time_text}</span>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 dark:border-slate-900 pt-4">
          <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 italic">
            Disclaimer: This location is based on community submissions. Please use your own judgement before visiting.
          </p>
        </div>

        {/* Confirmations panel */}
        {showConfirmOptions && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 p-4 space-y-3">
            <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">Are you near this location?</h4>
            <p className="text-xs text-slate-505 dark:text-slate-400">Your selection builds community confidence.</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                disabled={submitting}
                onClick={() => handleConfirmSubmit('confirmed_here')}
                className="flex items-center justify-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
              >
                <Check className="h-3.5 w-3.5 text-green-500" /> Yes, here
              </button>
              <button
                disabled={submitting}
                onClick={() => handleConfirmSubmit('confirmed_seen')}
                className="flex items-center justify-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
              >
                <ThumbsUp className="h-3.5 w-3.5 text-blue-500" /> Visited/Saw it
              </button>
              <button
                disabled={submitting}
                onClick={() => handleConfirmSubmit('not_found')}
                className="flex items-center justify-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
              >
                <X className="h-3.5 w-3.5 text-red-500" /> Not found
              </button>
              <button
                disabled={submitting}
                onClick={() => handleConfirmSubmit('closed')}
                className="flex items-center justify-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
              >
                <X className="h-3.5 w-3.5 text-orange-500" /> Closed now
              </button>
            </div>
            <button
              onClick={() => setShowConfirmOptions(false)}
              className="mt-2 block w-full text-center text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white cursor-pointer"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Reporting panel */}
        {showReportOptions && (
          <form onSubmit={handleReportSubmit} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 p-4 space-y-3">
            <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">Report inaccuracies</h4>
            <div className="space-y-2">
              <label className="block text-[10px] text-slate-550 dark:text-slate-400 uppercase">Reason</label>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-2 text-xs text-slate-805 dark:text-slate-250 focus:border-amber-500 focus:outline-none"
              >
                <option value="wrong_location">Wrong Coordinates</option>
                <option value="duplicate">Duplicate Marker</option>
                <option value="not_vesak_related">Not Vesak Related</option>
                <option value="closed">Closed / Disassembled</option>
                <option value="fake_or_spam">Fake or Spam</option>
                <option value="inappropriate">Inappropriate text</option>
                <option value="other">Other reason</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] text-slate-550 dark:text-slate-400 uppercase">Note / සටහන (Optional)</label>
              <textarea
                value={reportNote}
                onChange={(e) => setReportNote(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-2 text-xs text-slate-805 dark:text-slate-250 focus:border-amber-500 focus:outline-none"
                placeholder="Describe details..."
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 rounded-lg bg-red-650 p-2 text-xs font-bold text-white hover:bg-red-700 cursor-pointer"
              >
                Submit Report
              </button>
              <button
                type="button"
                onClick={() => setShowReportOptions(false)}
                className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-650 dark:text-slate-355 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Buttons grid */}
        {!showConfirmOptions && !showReportOptions && (
          <div className="grid grid-cols-2 gap-2 border-t border-slate-200 dark:border-slate-900 pt-4">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 p-3 text-xs font-bold text-slate-955 shadow-md shadow-amber-500/10 hover:scale-102 cursor-pointer"
            >
              <Navigation className="h-4 w-4" />
              <span>Navigate / මඟ පෙන්වන්න</span>
            </a>
            <button
              onClick={() => {
                if (!session) {
                  alert('Please sign in to confirm details.');
                  return;
                }
                setShowConfirmOptions(true);
              }}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-3 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-850 cursor-pointer"
            >
              <UserCheck className="h-4 w-4 text-amber-505 dark:text-amber-400" />
              <span>Confirm / තහවුරු කරන්න</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-3 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-850 cursor-pointer"
            >
              <Share2 className="h-4 w-4 text-slate-500 dark:text-slate-300" />
              <span>Share Location</span>
            </button>
            <button
              onClick={() => {
                if (!session) {
                  alert('Please sign in to submit reports.');
                  return;
                }
                setShowReportOptions(true);
              }}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-red-200 dark:border-red-500/10 bg-red-50 dark:bg-red-950/10 p-3 text-xs font-bold text-red-650 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/20 cursor-pointer"
            >
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span>Report Incorrect / වැරදියි</span>
            </button>
          </div>
        )}

        {/* Creator delete option */}
        {session && place.added_by === session.id && onDelete && (
          <div className="border-t border-slate-200 dark:border-slate-900 pt-4 mt-2">
            <button
              onClick={async () => {
                if (confirm('Are you sure you want to delete your pinned location permanently? This cannot be undone.')) {
                  setSubmitting(true);
                  try {
                    const res = await onDelete(place.id);
                    if (res && res.success) {
                      alert('Location deleted successfully.');
                    }
                  } catch (e) {
                    console.error(e);
                  } finally {
                    setSubmitting(false);
                  }
                }
              }}
              disabled={submitting}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-red-200 dark:border-red-500/10 bg-red-50 dark:bg-red-950/15 py-3 text-xs font-bold text-red-650 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/25 cursor-pointer transition-colors"
            >
              <span>Delete Location / මකා දමන්න</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
