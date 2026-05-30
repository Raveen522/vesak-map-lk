import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/server';

export type PlaceTrustStatus =
  | 'new'
  | 'community_confirmed'
  | 'highly_confirmed'
  | 'disputed'
  | 'likely_wrong'
  | 'hidden_by_community';

/**
 * Calculates trust status based on counts
 */
export function calculateTrustStatus(
  strongConfirmCount: number,
  weakConfirmCount: number,
  reportCount: number
): PlaceTrustStatus {
  if (reportCount >= 5 && strongConfirmCount < 2) {
    return 'hidden_by_community';
  } else if (reportCount >= 3 && reportCount > strongConfirmCount) {
    return 'likely_wrong';
  } else if (reportCount >= 2) {
    return 'disputed';
  } else if (strongConfirmCount >= 8) {
    return 'highly_confirmed';
  } else if (strongConfirmCount >= 3) {
    return 'community_confirmed';
  } else {
    return 'new';
  }
}

/**
 * Fetches confirmations and reports for a place and updates its trust status in Supabase
 */
export async function updatePlaceTrustInDb(placeId: string): Promise<void> {
  if (!isSupabaseConfigured || !supabaseAdmin) {
    return;
  }

  try {
    // 1. Get confirmation counts
    const { data: confirmations, error: confError } = await supabaseAdmin
      .from('place_confirmations')
      .select('is_nearby, confirmation_type')
      .eq('place_id', placeId);

    if (confError) throw confError;

    // 2. Get report counts
    const { count: reportCount, error: repError } = await supabaseAdmin
      .from('place_reports')
      .select('*', { count: 'exact', head: true })
      .eq('place_id', placeId);

    if (repError) throw repError;

    // 3. Separate strong vs weak confirmations
    // Note: confirmation_type can also indicate closed/wrong which increases report signals,
    // but here we count positive confirmations (confirmed_here, confirmed_seen)
    const positiveConfs = confirmations.filter(
      (c) => c.confirmation_type === 'confirmed_here' || c.confirmation_type === 'confirmed_seen'
    );
    const negativeConfsCount = confirmations.filter(
      (c) =>
        c.confirmation_type === 'not_found' ||
        c.confirmation_type === 'closed' ||
        c.confirmation_type === 'wrong_location' ||
        c.confirmation_type === 'duplicate'
    ).length;

    const strongConfirmCount = positiveConfs.filter((c) => c.is_nearby).length;
    const weakConfirmCount = positiveConfs.filter((c) => !c.is_nearby).length;

    // Include negative confirmations in the report calculation for trust
    const effectiveReportCount = (reportCount || 0) + negativeConfsCount;

    // 4. Calculate status
    const trustStatus = calculateTrustStatus(
      strongConfirmCount,
      weakConfirmCount,
      effectiveReportCount
    );

    // 5. Update place database fields
    const { error: updateError } = await supabaseAdmin
      .from('places')
      .update({
        strong_confirm_count: strongConfirmCount,
        weak_confirm_count: weakConfirmCount,
        report_count: effectiveReportCount,
        trust_status: trustStatus,
        last_confirmed_at: positiveConfs.length > 0 ? new Date().toISOString() : null,
        last_reported_at: effectiveReportCount > 0 ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', placeId);

    if (updateError) throw updateError;
  } catch (err) {
    console.error(`Failed to recalculate trust status for place ${placeId}:`, err);
  }
}
