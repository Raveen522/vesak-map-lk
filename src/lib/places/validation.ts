// Sri Lanka rough coordinate bounds
export const SRI_LANKA_BOUNDS = {
  minLat: 5.8,
  maxLat: 10.1,
  minLng: 79.5,
  maxLng: 82.1,
};

/**
 * Validates if coordinates are within Sri Lankan boundaries
 */
export function isWithinSriLanka(lat: number, lng: number): boolean {
  return (
    lat >= SRI_LANKA_BOUNDS.minLat &&
    lat <= SRI_LANKA_BOUNDS.maxLat &&
    lng >= SRI_LANKA_BOUNDS.minLng &&
    lng <= SRI_LANKA_BOUNDS.maxLng
  );
}

/**
 * Validates place inputs
 */
export function validatePlaceInput(title: string, description?: string): string | null {
  if (!title || title.trim().length < 3) {
    return 'Title must be at least 3 characters long.';
  }
  if (title.length > 80) {
    return 'Title must be less than 80 characters.';
  }
  if (description && description.length > 300) {
    return 'Description must be less than 300 characters.';
  }
  // Check if title contains a mobile number patterns
  const mobileRegex = /(?:0|94|\+94)?7[0-9]{8}/;
  if (mobileRegex.test(title)) {
    return 'Please do not include phone numbers in the title. Add them to description or notes instead.';
  }
  return null;
}

/**
 * Normalizes Sri Lankan mobile numbers to the format +947XXXXXXXX
 */
export function normalizeMobileNumber(mobile: string): string | null {
  // Remove all non-digit characters except +
  let cleaned = mobile.replace(/[^\d+]/g, '');

  // If starts with +947... and length is 12 (+947XXXXXXXX)
  if (cleaned.startsWith('+947') && cleaned.length === 12) {
    return cleaned;
  }

  // If starts with 947... and length is 11 (947XXXXXXXX)
  if (cleaned.startsWith('947') && cleaned.length === 11) {
    return '+' + cleaned;
  }

  // If starts with 07... and length is 10 (07XXXXXXXX)
  if (cleaned.startsWith('07') && cleaned.length === 10) {
    return '+94' + cleaned.substring(1);
  }

  // If starts with 7... and length is 9 (7XXXXXXXX)
  if (cleaned.startsWith('7') && cleaned.length === 9) {
    return '+94' + cleaned;
  }

  return null; // Invalid format
}
