'use server';

import { getSession, setSession, clearSession, UserSession } from '@/lib/auth/session';
import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase/server';
import { mockDb } from '@/lib/places/mockDb';
import { getDistanceMeters } from '@/lib/map/distance';
import {
  isWithinSriLanka,
  validatePlaceInput,
  normalizeMobileNumber,
} from '@/lib/places/validation';
import { updatePlaceTrustInDb } from '@/lib/places/trust';

export interface ActionResponse<T> {
  success: boolean;
  error?: string;
  data?: T;
}

/**
 * Handle lightweight login/signup
 */
export async function loginAction(
  name: string,
  mobileNumber: string
): Promise<ActionResponse<UserSession>> {
  try {
    if (!name || name.trim().length < 2) {
      return { success: false, error: 'Name must be at least 2 characters.' };
    }

    const normalized = normalizeMobileNumber(mobileNumber);
    if (!normalized) {
      return { success: false, error: 'Invalid Sri Lankan mobile number format.' };
    }

    let userSession: UserSession;

    if (isSupabaseConfigured && supabaseAdmin) {
      // Supabase Flow
      // Check if user exists
      const { data: existingUser, error: fetchErr } = await supabaseAdmin
        .from('community_users')
        .select('*')
        .eq('mobile_number', normalized)
        .maybeSingle();

      if (fetchErr) throw fetchErr;

      let userId = '';
      let displayName = name;

      if (existingUser) {
        if (existingUser.is_blocked) {
          return { success: false, error: 'This user account is suspended.' };
        }
        userId = existingUser.id;
        displayName = existingUser.display_name || existingUser.name;
      } else {
        // Create new user
        const { data: newUser, error: insertErr } = await supabaseAdmin
          .from('community_users')
          .insert({
            name,
            mobile_number: normalized,
            display_name: name,
          })
          .select()
          .single();

        if (insertErr) throw insertErr;
        userId = newUser.id;
        displayName = newUser.display_name;
      }

      userSession = {
        id: userId,
        name: name,
        displayName: displayName,
      };
    } else {
      // Mock Flow
      const mockUser = await mockDb.loginOrSignup(name, normalized);
      userSession = {
        id: mockUser.id,
        name: mockUser.name,
        displayName: mockUser.display_name,
      };
    }

    await setSession(userSession);
    return { success: true, data: userSession };
  } catch (err: any) {
    console.error('Login action error:', err);
    return { success: false, error: err.message || 'An error occurred during sign-in.' };
  }
}

/**
 * Logout action
 */
export async function logoutAction(): Promise<ActionResponse<void>> {
  await clearSession();
  return { success: true };
}

/**
 * Get all active pins
 */
export async function getPlacesAction(): Promise<ActionResponse<any[]>> {
  try {
    if (isSupabaseConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('places')
        .select('*')
        .neq('trust_status', 'hidden_by_community')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data: data || [] };
    } else {
      const data = await mockDb.getPlaces();
      // Filter out hidden
      const filtered = data.filter((p) => p.trust_status !== 'hidden_by_community');
      return { success: true, data: filtered };
    }
  } catch (err: any) {
    console.error('Get places error:', err);
    return { success: false, error: 'Could not retrieve map pins.' };
  }
}

/**
 * Add a new location pin
 */
export async function addPlaceAction(placeData: {
  category: 'thorana' | 'lantern' | 'dansal';
  title: string;
  description: string;
  areaName: string;
  addressText: string;
  latitude: number;
  longitude: number;
  startDate?: string;
  endDate?: string;
  timeText?: string;
}): Promise<ActionResponse<any>> {
  try {
    // 1. Authenticate user
    const session = await getSession();
    if (!session) {
      return { success: false, error: 'You must be logged in to add locations.' };
    }

    // Clear legacy mock session if using Supabase
    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (isSupabaseConfigured && !UUID_REGEX.test(session.id)) {
      await clearSession();
      return { success: false, error: 'Your session has expired. Please log in again.' };
    }

    // 2. Validate bounds
    if (!isWithinSriLanka(placeData.latitude, placeData.longitude)) {
      return {
        success: false,
        error: 'Location appears to be outside Sri Lanka bounds. Please adjust the marker.',
      };
    }

    // 3. Validate text parameters
    const textError = validatePlaceInput(placeData.title, placeData.description);
    if (textError) {
      return { success: false, error: textError };
    }

    // 4. Duplicate Check (within 100 meters, same category)
    let currentPlaces: any[] = [];
    if (isSupabaseConfigured && supabaseAdmin) {
      const { data } = await supabaseAdmin.from('places').select('*').eq('category', placeData.category);
      currentPlaces = data || [];
    } else {
      currentPlaces = await mockDb.getPlaces();
      currentPlaces = currentPlaces.filter((p) => p.category === placeData.category);
    }

    const duplicateLimitMeters = 100;
    const isDuplicate = currentPlaces.some((p) => {
      const distance = getDistanceMeters(
        placeData.latitude,
        placeData.longitude,
        p.latitude,
        p.longitude
      );
      return distance < duplicateLimitMeters;
    });

    if (isDuplicate) {
      return {
        success: false,
        error: 'A similar Vesak location may already exist nearby. Please confirm or update the existing pin instead.',
      };
    }

    // 5. Insert Record
    if (isSupabaseConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('places')
        .insert({
          category: placeData.category,
          title: placeData.title,
          description: placeData.description,
          area_name: placeData.areaName,
          address_text: placeData.addressText,
          latitude: placeData.latitude,
          longitude: placeData.longitude,
          start_date: placeData.startDate ? new Date(placeData.startDate).toISOString().split('T')[0] : null,
          end_date: placeData.endDate ? new Date(placeData.endDate).toISOString().split('T')[0] : null,
          time_text: placeData.timeText,
          added_by: session.id,
          trust_status: 'new',
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } else {
      const newMockPlace = await mockDb.addPlace({
        category: placeData.category,
        title: placeData.title,
        description: placeData.description,
        area_name: placeData.areaName,
        address_text: placeData.addressText,
        latitude: placeData.latitude,
        longitude: placeData.longitude,
        start_date: placeData.startDate,
        end_date: placeData.endDate,
        time_text: placeData.timeText,
        added_by: session.id,
      });
      return { success: true, data: newMockPlace };
    }
  } catch (err: any) {
    console.error('Add place error:', err);
    return { success: false, error: err.message || 'Failed to submit place.' };
  }
}

/**
 * Confirm place existence
 */
export async function confirmPlaceAction(
  placeId: string,
  confirmationType: 'confirmed_here' | 'confirmed_seen' | 'not_found' | 'closed' | 'wrong_location' | 'duplicate',
  userLat?: number,
  userLng?: number
): Promise<ActionResponse<any>> {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: 'You must be logged in to confirm locations.' };
    }

    // Clear legacy mock session if using Supabase
    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (isSupabaseConfigured && !UUID_REGEX.test(session.id)) {
      await clearSession();
      return { success: false, error: 'Your session has expired. Please log in again.' };
    }

    // Retrieve target place coords to determine proximity
    let placeCoords: { lat: number; lng: number } | null = null;
    if (isSupabaseConfigured && supabaseAdmin) {
      const { data } = await supabaseAdmin
        .from('places')
        .select('latitude, longitude')
        .eq('id', placeId)
        .maybeSingle();
      if (data) {
        placeCoords = { lat: data.latitude, lng: data.longitude };
      }
    } else {
      const data = await mockDb.getPlaceById(placeId);
      if (data) {
        placeCoords = { lat: data.latitude, lng: data.longitude };
      }
    }

    if (!placeCoords) {
      return { success: false, error: 'Place not found.' };
    }

    let isNearby = false;
    let distanceMeters: number | undefined;

    if (userLat !== undefined && userLng !== undefined) {
      distanceMeters = getDistanceMeters(
        placeCoords.lat,
        placeCoords.lng,
        userLat,
        userLng
      );
      isNearby = distanceMeters <= 500; // Strong confirmation threshold (500 meters)
    }

    if (isSupabaseConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('place_confirmations')
        .upsert(
          {
            place_id: placeId,
            user_id: session.id,
            confirmation_type: confirmationType,
            user_latitude: userLat || null,
            user_longitude: userLng || null,
            distance_meters: distanceMeters || null,
            is_nearby: isNearby,
          },
          { onConflict: 'place_id,user_id,confirmation_type' }
        )
        .select()
        .single();

      if (error) throw error;

      // Recalculate place trust status
      await updatePlaceTrustInDb(placeId);

      return { success: true, data };
    } else {
      const updatedPlace = await mockDb.confirmPlace(placeId, confirmationType, isNearby);
      return { success: true, data: updatedPlace };
    }
  } catch (err: any) {
    console.error('Confirm place error:', err);
    return { success: false, error: err.message || 'Failed to submit confirmation.' };
  }
}

/**
 * Report place inaccuracy
 */
export async function reportPlaceAction(
  placeId: string,
  reason: 'wrong_location' | 'duplicate' | 'not_vesak_related' | 'closed' | 'fake_or_spam' | 'inappropriate' | 'other',
  note: string
): Promise<ActionResponse<any>> {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: 'You must be logged in to report locations.' };
    }

    // Clear legacy mock session if using Supabase
    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (isSupabaseConfigured && !UUID_REGEX.test(session.id)) {
      await clearSession();
      return { success: false, error: 'Your session has expired. Please log in again.' };
    }

    if (isSupabaseConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('place_reports')
        .upsert(
          {
            place_id: placeId,
            user_id: session.id,
            reason: reason,
            note: note,
          },
          { onConflict: 'place_id,user_id,reason' }
        )
        .select()
        .single();

      if (error) throw error;

      // Recalculate place trust status
      await updatePlaceTrustInDb(placeId);

      return { success: true, data };
    } else {
      const updatedPlace = await mockDb.reportPlace(placeId, reason);
      return { success: true, data: updatedPlace };
    }
  } catch (err: any) {
    console.error('Report place error:', err);
    return { success: false, error: err.message || 'Failed to submit report.' };
  }
}

/**
 * Delete a location pin by its creator
 */
export async function deletePlaceAction(placeId: string): Promise<ActionResponse<void>> {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: 'You must be logged in to delete pins.' };
    }

    if (isSupabaseConfigured && supabaseAdmin) {
      // Fetch the place to verify creator
      const { data: place, error: fetchError } = await supabaseAdmin
        .from('places')
        .select('added_by')
        .eq('id', placeId)
        .maybeSingle();

      if (fetchError) throw fetchError;
      if (!place) {
        return { success: false, error: 'Location not found.' };
      }

      if (place.added_by !== session.id) {
        return { success: false, error: 'You are not authorized to delete this pin.' };
      }

      // Perform deletion
      const { error: deleteError } = await supabaseAdmin
        .from('places')
        .delete()
        .eq('id', placeId);

      if (deleteError) throw deleteError;
    } else {
      // Mock flow
      const place = await mockDb.getPlaceById(placeId);
      if (!place) {
        return { success: false, error: 'Location not found.' };
      }
      if (place.added_by !== session.id) {
        return { success: false, error: 'You are not authorized to delete this pin.' };
      }

      const places = await mockDb.getPlaces();
      const updatedPlaces = places.filter((p) => p.id !== placeId);
      if (typeof window !== 'undefined') {
        localStorage.setItem('vesak_mock_places', JSON.stringify(updatedPlaces));
      }
    }

    return { success: true };
  } catch (err: any) {
    console.error('Delete place error:', err);
    return { success: false, error: err.message || 'Failed to delete pin.' };
  }
}
