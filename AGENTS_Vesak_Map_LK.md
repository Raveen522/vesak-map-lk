# AGENTS.md — Vesak Map LK

## 1. Project Identity

**Project name:** Vesak Map LK  
**Project type:** Free community-supported web map application  
**Primary country/region:** Sri Lanka  
**Main purpose:** Help people discover Vesak Thoran, Vesak Koodu / lantern displays, and Dansal near their current location or searched location during Vesak season.

This project is not a commercial app. It should be lightweight, low-cost, mobile-first, and simple enough for the public to use without training.

The app is based on community-pinned data. Users add locations they know. Other users confirm, report, or correct those locations. There is no manual admin approval flow in the MVP. The system should use community signals to decide which pins are trustworthy.

---

## 2. Product Summary

Vesak Map LK is a community map where users can:

1. Sign up / log in with name and mobile number.
2. Add map pins for:
   - Vesak Thorana / වෙසක් තොරණ
   - Vesak Koodu / Vesak lantern displays / වෙසක් කූඩු
   - Dansal / දන්සල්
3. Search and view nearby Vesak locations.
4. Confirm whether a location exists.
5. Report wrong, duplicate, closed, or suspicious pins.
6. Use filters to find only Thoran, lanterns, or Dansal.
7. Open a selected location in Google Maps or another navigation app.

The product should feel like a simple Sri Lankan community utility, not a complex social media platform.

---

## 3. Core Principles

### 3.1 Free and low-cost

The project must be built in a way that can run free or very low cost.

Prefer:

- Open-source libraries.
- Free hosting tiers.
- Free database tier.
- OpenStreetMap-based map rendering.
- No paid SMS OTP in the MVP.
- No paid Google Maps dependency for the main map.

Avoid:

- Google Maps JavaScript API as the primary map provider.
- Paid SMS login.
- Heavy backend infrastructure.
- Expensive image storage from the beginning.
- Unnecessary real-time features.

### 3.2 Lightweight and mobile-first

Most users will use mobile phones. Some may be on mobile data.

The app must:

- Load fast.
- Work well on small screens.
- Avoid heavy animations.
- Avoid unnecessary map redraws.
- Load only nearby or visible pins.
- Use clustering when many pins are visible.
- Use simple UI and large touch targets.

### 3.3 Community-moderated, not admin-controlled

There should be no approval queue where the owner must approve each pin.

The owner does not want to be responsible for the correctness of user-submitted pins.

The app should clearly communicate:

> Locations are added and verified by the community. Please confirm details before visiting.

Pins should become more or less trusted based on community confirmations and reports.

### 3.4 Privacy-conscious

The app collects only minimum required user details:

- Name
- Mobile number

Do not publicly display mobile numbers.

Do not expose exact user identity on every pin unless needed. Public pin metadata can show something like:

- Added by community member
- Confirmed by 5 users

For MVP, do not collect NIC, address, email, or other personal details.

---

## 4. Recommended Tech Stack

Use the following stack unless there is a strong reason not to.

### 4.1 Frontend

- Next.js with App Router
- TypeScript
- Tailwind CSS
- React Leaflet / Leaflet
- Leaflet marker clustering library
- Responsive mobile-first UI

### 4.2 Backend

- Supabase
  - PostgreSQL database
  - Row Level Security
  - Supabase client SDK
  - Optional Supabase Storage later for images

### 4.3 Map

Primary MVP choice:

- Leaflet
- OpenStreetMap-based tile layer

Important:

- The tile provider must be configurable using environment variables.
- Do not hard-code a single tile provider deep inside components.
- Keep the map abstraction flexible so the tile provider can later change to Geoapify, MapTiler, Stadia Maps, or another OSM-compatible provider.

### 4.4 Hosting

Preferred:

- Netlify
- Vercel
- Cloudflare Pages

Use whichever is easiest for deployment.

---

## 5. App Routes / Pages

Use a simple route structure.

```txt
/
  Home page / landing page with map and nearby discovery

/map
  Main public map view

/add
  Add new pin form

/login
  Login / signup with name + mobile number

/profile
  Simple user profile and user's submitted pins

/place/[id]
  Place detail page

/about
  About the project and community notice

/privacy
  Privacy policy

/terms
  Terms / community disclaimer
```

Admin routes are not required for MVP.

---

## 6. Main User Flows

### 6.1 Public discovery flow

User opens the website.

The app should:

1. Show simple landing content.
2. Ask permission to use current location.
3. If permission granted:
   - Center map on current location.
   - Show nearby pins.
4. If permission denied:
   - Show search input.
   - Allow searching by town/city.
5. Allow filtering by:
   - All
   - Thoran
   - Vesak Koodu
   - Dansal
6. User taps marker.
7. Bottom sheet / popup shows:
   - Title
   - Type
   - Distance
   - Trust status
   - Confirm count
   - Report count if relevant
   - Buttons:
     - View details
     - Navigate
     - Confirm
     - Report

### 6.2 Add pin flow

User must be logged in before adding a pin.

Steps:

1. User clicks "Add Location".
2. If not logged in, redirect to `/login`.
3. User selects type:
   - Thorana
   - Vesak Koodu
   - Dansal
4. User enters:
   - Title
   - Short description
   - Date/time info
   - Optional notes
5. User sets location:
   - Use current GPS location, or
   - Tap on map, or
   - Search town/location and adjust marker
6. User submits.
7. Pin appears immediately as `unconfirmed`.
8. Other community users can confirm/report.

### 6.3 Confirm pin flow

User taps an existing place and clicks "Confirm".

The system should:

1. Require login.
2. Get user's current location if possible.
3. If user is near the place, allow strong confirmation.
4. If user is not near, either:
   - Block confirmation, or
   - Save it as weak confirmation.

Recommended MVP rule:

- Strong confirmation: user is within 500 meters.
- Weak confirmation: user is farther than 500 meters.
- Trust score should prioritize strong confirmations.

Confirmation options:

- Yes, this is here
- I visited / saw this
- This is not here
- This is closed now
- This is duplicate
- Wrong location

### 6.4 Report pin flow

User taps Report.

Report reasons:

- Wrong location
- Duplicate
- Not related to Vesak
- Closed / no longer available
- Fake / spam
- Inappropriate title or description
- Other

Report should not immediately delete a pin unless abuse is obvious. Instead, update community trust status.

### 6.5 Login/signup flow

No OTP in MVP.

Use:

- Name
- Mobile number

Possible simple login approach:

1. User enters name and mobile number.
2. If mobile number exists, login existing user.
3. If not, create a user profile.
4. Store user session locally using Supabase auth alternative or simple custom session approach.

Preferred for security:

- Use Supabase Auth with phone later if OTP is affordable.
- For MVP, if using custom login, do not treat it as high-security authentication.
- Clearly avoid showing private user data.

Do not use mobile number as public display name.

---

## 7. Place Categories

Use these category values in code and database:

```ts
type PlaceCategory = 'thorana' | 'lantern' | 'dansal';
```

Display labels:

```ts
const CATEGORY_LABELS = {
  thorana: 'Vesak Thorana',
  lantern: 'Vesak Koodu / Lanterns',
  dansal: 'Dansal',
};
```

Sinhala labels:

```ts
const CATEGORY_LABELS_SI = {
  thorana: 'වෙසක් තොරණ',
  lantern: 'වෙසක් කූඩු',
  dansal: 'දන්සල්',
};
```

The UI can initially be English-first with Sinhala words included. Later it can support Sinhala/English language switching.

---

## 8. Community Trust System

There is no admin approval. Therefore trust status is very important.

Each place should have a computed trust state.

Recommended statuses:

```ts
type PlaceTrustStatus =
  | 'new'
  | 'community_confirmed'
  | 'highly_confirmed'
  | 'disputed'
  | 'likely_wrong'
  | 'hidden_by_community';
```

Suggested rules:

```txt
new:
  Default state after creation.

community_confirmed:
  At least 3 strong confirmations and fewer than 2 valid reports.

highly_confirmed:
  At least 8 strong confirmations and report ratio is low.

disputed:
  At least 2 reports or mixed confirmation/report signals.

likely_wrong:
  Reports are higher than confirmations.

hidden_by_community:
  Many reports, for example 5+ reports and low confirmations.
```

Important:

- Do not permanently delete community data automatically.
- Hide from default map view if `hidden_by_community`.
- Still allow showing hidden/disputed data in a debug or low-trust mode later, if needed.
- For MVP, simply exclude `hidden_by_community` from normal map results.

Trust score example:

```txt
trust_score =
  strong_confirmations * 3
  + weak_confirmations * 1
  - wrong_location_reports * 3
  - fake_reports * 5
  - duplicate_reports * 2
```

Use this only as a guide. Keep implementation understandable.

---

## 9. Distance and Location Rules

### 9.1 Nearby pins

Nearby discovery should use the user's current location.

Default search radius:

- 5 km for current location.
- Allow user to expand to 10 km, 25 km, 50 km.

### 9.2 Map viewport loading

Do not fetch all pins in Sri Lanka.

Fetch pins based on:

- Current map bounding box, or
- Center point + radius.

### 9.3 Confirmation distance

Strong confirmation:

- User is within 500 meters of pin.

Weak confirmation:

- User is farther than 500 meters.

For MVP, do not make this too strict because GPS accuracy may vary.

### 9.4 Navigation

Each place detail should have a navigation button.

Generate navigation link:

```txt
https://www.google.com/maps/search/?api=1&query={latitude},{longitude}
```

This does not require Google Maps JavaScript API.

---

## 10. Database Design

Use Supabase PostgreSQL.

Enable Row Level Security.

Use `uuid` primary keys.

### 10.1 `community_users`

Custom lightweight user table.

```sql
create table public.community_users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  mobile_number text not null unique,
  display_name text,
  is_blocked boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

Notes:

- `mobile_number` must be private.
- `display_name` can be public.
- If no display name, show "Community member".

### 10.2 `places`

```sql
create table public.places (
  id uuid primary key default gen_random_uuid(),

  category text not null check (category in ('thorana', 'lantern', 'dansal')),

  title text not null,
  description text,
  area_name text,
  address_text text,

  latitude double precision not null,
  longitude double precision not null,

  start_date date,
  end_date date,
  time_text text,

  added_by uuid references public.community_users(id) on delete set null,

  trust_status text not null default 'new'
    check (trust_status in (
      'new',
      'community_confirmed',
      'highly_confirmed',
      'disputed',
      'likely_wrong',
      'hidden_by_community'
    )),

  strong_confirm_count integer not null default 0,
  weak_confirm_count integer not null default 0,
  report_count integer not null default 0,

  last_confirmed_at timestamptz,
  last_reported_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### 10.3 `place_confirmations`

```sql
create table public.place_confirmations (
  id uuid primary key default gen_random_uuid(),

  place_id uuid not null references public.places(id) on delete cascade,
  user_id uuid not null references public.community_users(id) on delete cascade,

  confirmation_type text not null check (confirmation_type in (
    'confirmed_here',
    'confirmed_seen',
    'not_found',
    'closed',
    'wrong_location',
    'duplicate'
  )),

  user_latitude double precision,
  user_longitude double precision,
  distance_meters double precision,
  is_nearby boolean not null default false,

  note text,

  created_at timestamptz not null default now(),

  unique (place_id, user_id, confirmation_type)
);
```

### 10.4 `place_reports`

```sql
create table public.place_reports (
  id uuid primary key default gen_random_uuid(),

  place_id uuid not null references public.places(id) on delete cascade,
  user_id uuid not null references public.community_users(id) on delete cascade,

  reason text not null check (reason in (
    'wrong_location',
    'duplicate',
    'not_vesak_related',
    'closed',
    'fake_or_spam',
    'inappropriate',
    'other'
  )),

  note text,

  created_at timestamptz not null default now(),

  unique (place_id, user_id, reason)
);
```

### 10.5 Optional later: `place_photos`

Do not implement photos in first MVP unless requested.

```sql
create table public.place_photos (
  id uuid primary key default gen_random_uuid(),
  place_id uuid not null references public.places(id) on delete cascade,
  uploaded_by uuid references public.community_users(id) on delete set null,
  image_url text not null,
  created_at timestamptz not null default now()
);
```

---

## 11. Row Level Security Guidance

This project has simple community behavior.

General rule:

- Anyone can read public places.
- Logged/community users can insert places.
- A user can edit/delete only their own place for a short time if implemented.
- Users can confirm/report places.
- Users cannot edit other users' confirmations/reports.
- Mobile numbers must not be publicly exposed.

If using custom `community_users` without Supabase Auth, be careful. RLS cannot fully protect per-user data without real auth. For MVP, either:

1. Use Supabase Auth anonymous/authenticated flow plus profile table, or
2. Use API routes/server actions to control inserts/updates instead of direct public client writes.

Recommended secure-ish MVP:

- Use Next.js server actions or API routes for write operations.
- Do not expose Supabase service role key to the browser.
- Browser can use anon key only for safe read operations.
- Write operations go through server-side validation.

---

## 12. Suggested Project Structure

```txt
vesak-map-lk/
  AGENTS.md
  README.md
  .env.example
  package.json
  next.config.ts
  src/
    app/
      layout.tsx
      page.tsx
      map/
        page.tsx
      add/
        page.tsx
      login/
        page.tsx
      profile/
        page.tsx
      place/
        [id]/
          page.tsx
      about/
        page.tsx
      privacy/
        page.tsx
      terms/
        page.tsx
      api/
        auth/
          login/
            route.ts
        places/
          route.ts
        places/
          [id]/
            confirm/
              route.ts
            report/
              route.ts
    components/
      layout/
        AppHeader.tsx
        BottomNav.tsx
      map/
        VesakMap.tsx
        MapMarker.tsx
        MarkerPopup.tsx
        MarkerClusterLayer.tsx
        LocateMeButton.tsx
        MapFilters.tsx
      places/
        PlaceCard.tsx
        PlaceDetail.tsx
        AddPlaceForm.tsx
        ConfirmPlacePanel.tsx
        ReportPlaceDialog.tsx
      auth/
        LoginForm.tsx
      ui/
        Button.tsx
        Input.tsx
        Select.tsx
        Badge.tsx
        BottomSheet.tsx
    lib/
      supabase/
        client.ts
        server.ts
      map/
        tileProvider.ts
        distance.ts
        bounds.ts
      places/
        trust.ts
        validation.ts
      auth/
        session.ts
      utils/
        format.ts
    types/
      place.ts
      user.ts
    styles/
      globals.css
  supabase/
    migrations/
      001_initial_schema.sql
```

---

## 13. Environment Variables

Create `.env.example`.

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=

NEXT_PUBLIC_MAP_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
NEXT_PUBLIC_MAP_ATTRIBUTION=© OpenStreetMap contributors

NEXT_PUBLIC_DEFAULT_LAT=7.8731
NEXT_PUBLIC_DEFAULT_LNG=80.7718
NEXT_PUBLIC_DEFAULT_ZOOM=8

NEXT_PUBLIC_APP_NAME=Vesak Map LK
```

Never commit real secrets.

---

## 14. UI/UX Requirements

### 14.1 Visual style

Use a clean Sri Lankan Vesak-inspired style.

Suggested feel:

- Warm but not too colorful.
- White/light background.
- Gold/yellow accent.
- Dark green or deep blue secondary color.
- Simple icon system.

Avoid:

- Overloaded religious visuals.
- Heavy animated decorations.
- Too many glowing effects.
- Cluttered map controls.

### 14.2 Mobile layout

Mobile is the priority.

Recommended UI:

- Header with app name and Add button.
- Map full screen.
- Floating filter chips.
- Locate me floating button.
- Bottom sheet for selected place.
- Bottom nav:
  - Map
  - Add
  - Profile

### 14.3 Desktop layout

Desktop can have:

- Map on right/full.
- Left sidebar for search/results/filters.
- Place list beside map.

Do not overbuild desktop first.

---

## 15. Map Requirements

### 15.1 Initial map behavior

On `/map`:

1. Try browser geolocation.
2. If allowed:
   - Center map on user location.
   - Fetch nearby places.
3. If denied:
   - Center on Sri Lanka.
   - Show search prompt.
4. Show filters.

### 15.2 Markers

Use different marker icons/colors for:

- Thorana
- Lantern
- Dansal

Marker trust visual:

- New: normal marker
- Community confirmed: stronger marker/badge
- Highly confirmed: highlighted marker
- Disputed: warning badge
- Likely wrong: faded marker
- Hidden: not shown by default

### 15.3 Clustering

Use marker clustering for dense areas such as Colombo, Kandy, Galle, Kurunegala, Gampaha, Matara, etc.

### 15.4 Fetch strategy

Do not fetch all places.

Use a query with:

- latitude/longitude bounding box, or
- RPC function for radius search.

For MVP, bounding box query is easier.

---

## 16. API / Server Route Requirements

Use API routes or server actions for writes.

### 16.1 Login route

`POST /api/auth/login`

Input:

```json
{
  "name": "Raveen",
  "mobileNumber": "07XXXXXXXX"
}
```

Behavior:

- Normalize mobile number.
- If user exists, return simple session token or user object.
- If not, create user.
- Do not expose other users' mobile numbers.

### 16.2 Create place

`POST /api/places`

Input:

```json
{
  "category": "dansal",
  "title": "Rice Dansala near temple",
  "description": "Rice and curry dansala near main road",
  "areaName": "Maharagama",
  "addressText": "Near main temple",
  "latitude": 6.848,
  "longitude": 79.926,
  "startDate": "2026-05-30",
  "endDate": "2026-06-01",
  "timeText": "From 7 PM"
}
```

Validation:

- User must be logged in.
- Category must be valid.
- Title required.
- Coordinates required.
- Coordinates must be inside Sri Lanka approximate bounds.
- Text lengths must be limited.

### 16.3 Confirm place

`POST /api/places/[id]/confirm`

Input:

```json
{
  "confirmationType": "confirmed_here",
  "userLatitude": 6.848,
  "userLongitude": 79.926,
  "note": "I saw it today"
}
```

Behavior:

- User must be logged in.
- Calculate distance.
- Mark `is_nearby` if within 500m.
- Insert or update confirmation.
- Recalculate place trust status.

### 16.4 Report place

`POST /api/places/[id]/report`

Input:

```json
{
  "reason": "wrong_location",
  "note": "Not at this point"
}
```

Behavior:

- User must be logged in.
- Insert report.
- Recalculate place trust status.

---

## 17. Validation Rules

### 17.1 Place title

- Required
- 3 to 80 characters
- No offensive text
- No phone numbers in title if possible

### 17.2 Description

- Optional
- Max 300 characters for MVP

### 17.3 Coordinates

Sri Lanka rough bounds:

```txt
Latitude: 5.8 to 10.1
Longitude: 79.5 to 82.1
```

Reject coordinates outside this range.

### 17.4 Mobile number

Accept Sri Lankan formats:

```txt
07XXXXXXXX
+947XXXXXXXX
947XXXXXXXX
```

Normalize internally to one format, preferably:

```txt
+947XXXXXXXX
```

Do not publicly display it.

---

## 18. Trust Recalculation Logic

Create a reusable function:

```ts
recalculateTrustStatus(placeId: string): Promise<void>
```

It should:

1. Count strong confirmations.
2. Count weak confirmations.
3. Count reports.
4. Count negative confirmation types:
   - not_found
   - closed
   - wrong_location
   - duplicate
5. Update:
   - strong_confirm_count
   - weak_confirm_count
   - report_count
   - trust_status
   - last_confirmed_at
   - last_reported_at

Suggested status logic:

```ts
if (reportCount >= 5 && strongConfirmCount < 2) {
  trustStatus = 'hidden_by_community';
} else if (reportCount >= 3 && reportCount > strongConfirmCount) {
  trustStatus = 'likely_wrong';
} else if (reportCount >= 2) {
  trustStatus = 'disputed';
} else if (strongConfirmCount >= 8) {
  trustStatus = 'highly_confirmed';
} else if (strongConfirmCount >= 3) {
  trustStatus = 'community_confirmed';
} else {
  trustStatus = 'new';
}
```

Keep this logic centralized. Do not duplicate it inside UI components.

---

## 19. Security and Abuse Prevention

Even without admin approval, basic abuse prevention is required.

MVP protections:

- Rate limit place creation by mobile number / session.
- Limit new places per user per day.
- Limit reports per user per place.
- Limit confirmations per user per place.
- Validate coordinate bounds.
- Sanitize text input.
- Do not allow raw HTML from users.
- Prevent duplicate pins nearby with same category/title.

Suggested limits:

```txt
Max places per user per day: 20
Max reports per user per day: 50
Max confirmations per user per day: 100
```

Before creating a new place, check if similar place exists within 100 meters.

If similar exists, show:

> A similar location may already exist nearby. Please confirm the existing pin instead of creating a duplicate.

---

## 20. Disclaimers / Responsibility

Because there is no admin approval, include clear notices.

Suggested public notice:

```txt
Vesak Map LK is a community-supported map. Locations are added, confirmed, and reported by users. Details may change, so please confirm before travelling.
```

On place detail:

```txt
This location is based on community submissions. Please use your own judgement before visiting.
```

On add form:

```txt
Please add only real Vesak-related locations. Wrong or fake locations may be hidden by the community.
```

Do not claim that all locations are officially verified.

---

## 21. SEO and Shareability

Each place should have a shareable URL:

```txt
/place/[id]
```

Place detail page should include:

- Title
- Category
- Area
- Open Graph tags if possible
- Simple share button

Example share text:

```txt
I found this Vesak location on Vesak Map LK: {title}
{url}
```

For MVP, SEO is less important than mobile usability, but basic metadata should be included.

---

## 22. Accessibility

Implement:

- Proper button labels.
- Sufficient color contrast.
- Keyboard navigable forms.
- `aria-label` for icon buttons.
- Do not rely only on marker color; include text/badges.

---

## 23. Development Commands

Use these commands if the project is created with Next.js.

```bash
npm install
npm run dev
npm run build
npm run lint
```

If using pnpm, use:

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
```

Prefer one package manager and keep it consistent.

---

## 24. Coding Standards

### 24.1 General

- Use TypeScript.
- Avoid `any` unless unavoidable.
- Keep components small.
- Put business logic in `lib/`.
- Keep API validation separate.
- Reuse types from `types/`.
- Do not duplicate category/trust constants.

### 24.2 React/Next.js

- Use server components where suitable.
- Use client components only for interactive map/UI parts.
- The map component must be dynamically imported because Leaflet depends on browser APIs.
- Avoid accessing `window` during server rendering.

Example pattern:

```ts
const VesakMap = dynamic(() => import('@/components/map/VesakMap'), {
  ssr: false,
});
```

### 24.3 Styling

- Use Tailwind CSS.
- Prefer simple reusable UI components.
- Do not use large UI libraries unless necessary.
- Keep the design clean and fast.

---

## 25. Leaflet / Next.js Notes

Leaflet must run only on the client.

Requirements:

- Import Leaflet CSS globally or in map component.
- Use dynamic import with `ssr: false`.
- Fix marker icon paths if default icons do not appear.
- Keep tile provider config in `lib/map/tileProvider.ts`.

Example tile provider config:

```ts
export const tileProvider = {
  url:
    process.env.NEXT_PUBLIC_MAP_TILE_URL ||
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution:
    process.env.NEXT_PUBLIC_MAP_ATTRIBUTION ||
    '© OpenStreetMap contributors',
};
```

---

## 26. MVP Build Order

Build in this order.

### Phase 1 — Project setup

1. Create Next.js app with TypeScript.
2. Add Tailwind CSS.
3. Add Supabase client setup.
4. Create `.env.example`.
5. Add basic layout/header.

### Phase 2 — Database

1. Create migration SQL.
2. Create tables:
   - community_users
   - places
   - place_confirmations
   - place_reports
3. Add basic indexes.
4. Add location-related indexes if needed.
5. Add RLS or server-side write protection.

### Phase 3 — Map

1. Add Leaflet map.
2. Center on Sri Lanka by default.
3. Add current location button.
4. Display sample static markers.
5. Replace sample markers with Supabase places.
6. Add category filters.
7. Add marker popup/bottom sheet.

### Phase 4 — Add location

1. Build login page.
2. Build add location form.
3. Add map click to set marker.
4. Add GPS current location option.
5. Submit place to API.
6. Show new pin on map.

### Phase 5 — Community confirmation/reporting

1. Add place detail page.
2. Add confirm action.
3. Add report action.
4. Implement trust recalculation.
5. Update marker UI by trust status.

### Phase 6 — Polish

1. Mobile UI improvements.
2. Loading states.
3. Empty states.
4. Error handling.
5. Basic privacy/terms pages.
6. Deployment.

---

## 27. Indexes and Performance

Add indexes:

```sql
create index places_category_idx on public.places(category);
create index places_trust_status_idx on public.places(trust_status);
create index places_created_at_idx on public.places(created_at desc);
create index places_lat_lng_idx on public.places(latitude, longitude);
create index place_confirmations_place_id_idx on public.place_confirmations(place_id);
create index place_reports_place_id_idx on public.place_reports(place_id);
```

For MVP, simple latitude/longitude bounding box filtering is enough.

Later, consider PostGIS if needed.

---

## 28. Query Strategy for Map Bounds

For visible map area, fetch:

```txt
latitude between south and north
longitude between west and east
trust_status not equal hidden_by_community
```

Also filter by category if selected.

Do not return too many rows.

Suggested limit:

```txt
500 places per map query
```

If more than 500, rely on clustering or zoom requirement.

---

## 29. Error Handling

Use friendly messages.

Examples:

```txt
Could not get your current location. You can search or move the map manually.
```

```txt
This location looks outside Sri Lanka. Please check the marker position.
```

```txt
A similar pin already exists nearby. Please confirm the existing one instead.
```

```txt
Something went wrong while saving. Please try again.
```

Avoid technical error messages in the UI.

---

## 30. Empty States

Map no results:

```txt
No Vesak locations found in this area yet. You can add one if you know a place.
```

Profile no pins:

```txt
You have not added any places yet.
```

Search no result:

```txt
Could not find that area. Try a nearby town name.
```

---

## 31. Future Features — Do Not Build in MVP Unless Asked

Possible later features:

- Sinhala/English language toggle.
- Photo uploads.
- Event date filters.
- Route planning.
- Public leaderboards.
- Trusted contributor badges.
- WhatsApp sharing templates.
- Offline support.
- PWA install.
- Heatmap of Vesak activity.
- Separate special page for “Best confirmed Dansal near me”.
- Temporary seasonal cleanup after Vesak.
- Import pins from CSV.
- Municipality/temple contributor accounts.

Do not build these in MVP unless specifically requested.

---

## 32. Testing Checklist

Before completing any task, verify:

- App builds successfully.
- Map does not crash during SSR.
- Current location works or fails gracefully.
- Pins load from Supabase.
- Category filters work.
- Add place form validates required fields.
- Coordinates outside Sri Lanka are rejected.
- Confirm action updates counts.
- Report action updates counts.
- Trust status recalculates.
- Hidden community pins do not show by default.
- Mobile layout is usable.
- No mobile numbers are shown publicly.
- No service role key is exposed to frontend.

---

## 33. Important Non-Goals

Do not implement these unless requested:

- Admin approval dashboard.
- Paid Google Maps JavaScript API integration.
- OTP SMS login.
- Complex social profiles.
- Comments/chat.
- Payment system.
- Advertising system.
- Heavy image gallery.
- Native mobile app.
- Full moderation team workflow.

---

## 34. README Requirements

Create or update `README.md` with:

1. Project description.
2. Tech stack.
3. Setup steps.
4. Environment variables.
5. Supabase migration instructions.
6. Development commands.
7. Deployment notes.
8. Community disclaimer.

---

## 35. Codex Task Behavior

When working on this project, the coding agent should:

1. Read this `AGENTS.md` before making changes.
2. Keep the MVP simple.
3. Avoid adding unnecessary libraries.
4. Prefer low-cost/free solutions.
5. Preserve the no-admin community moderation model.
6. Never expose private mobile numbers.
7. Never add OTP/SMS unless explicitly asked.
8. Never add Google Maps JavaScript API unless explicitly asked.
9. Keep the map provider configurable.
10. Explain major architectural decisions in code comments or README when useful.

---

## 36. First Implementation Prompt for Codex

Use this prompt after placing this file in the repo root:

```txt
Build the MVP for Vesak Map LK according to AGENTS.md.

Start with a Next.js + TypeScript + Tailwind setup using Leaflet for the map and Supabase for data.

Implement:
1. Main map page with current location, category filters, and community pins.
2. Login/signup using name and mobile number without OTP.
3. Add place form for Thorana, Vesak Koodu/Lanterns, and Dansal.
4. Place detail view.
5. Community confirm and report actions.
6. Trust status recalculation.
7. Supabase SQL migration for the required tables.
8. Basic README and .env.example.

Do not build an admin panel.
Do not use Google Maps JavaScript API.
Do not use SMS OTP.
Keep the app lightweight and mobile-first.
```

---

## 37. Final Product Direction

The final MVP should answer one simple user need:

> “Where are the nearest Vesak Thoran, Vesak Koodu, and Dansal around me?”

Everything else should support that goal.

Keep the product simple, fast, free, and community-driven.
