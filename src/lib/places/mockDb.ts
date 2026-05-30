export interface MockPlace {
  id: string;
  category: 'thorana' | 'lantern' | 'dansal';
  title: string;
  description: string;
  area_name: string;
  address_text: string;
  latitude: number;
  longitude: number;
  start_date?: string;
  end_date?: string;
  time_text?: string;
  added_by?: string;
  trust_status: 'new' | 'community_confirmed' | 'highly_confirmed' | 'disputed' | 'likely_wrong' | 'hidden_by_community';
  strong_confirm_count: number;
  weak_confirm_count: number;
  report_count: number;
  last_confirmed_at?: string;
  last_reported_at?: string;
  created_at: string;
}

export interface MockUser {
  id: string;
  name: string;
  mobile_number: string;
  display_name: string;
  is_blocked: boolean;
  created_at: string;
}

const SEED_PLACES: MockPlace[] = [
  {
    id: "mock-1",
    category: "lantern",
    title: "Gangarama Buddha Rashmi Vesak Kalapaya",
    description: "Spectacular Vesak lantern display and floating stage events surrounding the Beira Lake.",
    area_name: "Colombo 02",
    address_text: "Beira Lake, Colombo 02",
    latitude: 6.9158,
    longitude: 79.8582,
    start_date: "2026-05-30",
    end_date: "2026-06-02",
    time_text: "7:00 PM onwards",
    trust_status: "highly_confirmed",
    strong_confirm_count: 14,
    weak_confirm_count: 5,
    report_count: 0,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: "mock-2",
    category: "thorana",
    title: "Thotalanga Vesak Thorana",
    description: "Famous Thorana representing Kundalakesi Jathaka story. Standing at 60 feet tall with thousands of light combinations.",
    area_name: "Thotalanga",
    address_text: "Thotalanga Junction, Colombo 14",
    latitude: 6.9585,
    longitude: 79.8680,
    start_date: "2026-05-30",
    end_date: "2026-06-04",
    time_text: "From 6:30 PM to midnight",
    trust_status: "community_confirmed",
    strong_confirm_count: 6,
    weak_confirm_count: 2,
    report_count: 0,
    created_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "mock-3",
    category: "dansal",
    title: "Fried Rice Dansala by Koswatta Youth",
    description: "Vegetarian fried rice with chili paste and ice cream for dessert. Long queue expected, parking nearby.",
    area_name: "Koswatta, Battaramulla",
    address_text: "Near Koswatta Junction, Battaramulla",
    latitude: 6.9067,
    longitude: 79.9298,
    start_date: "2026-05-31",
    end_date: "2026-05-31",
    time_text: "Starts at 6:00 PM until food runs out",
    trust_status: "new",
    strong_confirm_count: 1,
    weak_confirm_count: 1,
    report_count: 0,
    created_at: new Date().toISOString()
  },
  {
    id: "mock-4",
    category: "lantern",
    title: "Bauddhaloka Vesak Zone Displays",
    description: "Massive displays of modern Vesak lanterns, light designs, and devotion songs performance.",
    area_name: "Colombo 07",
    address_text: "Bauddhaloka Mawatha, Colombo 07",
    latitude: 6.9015,
    longitude: 79.8625,
    start_date: "2026-05-30",
    end_date: "2026-06-02",
    time_text: "6:00 PM - 11:30 PM",
    trust_status: "highly_confirmed",
    strong_confirm_count: 9,
    weak_confirm_count: 3,
    report_count: 0,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: "mock-5",
    category: "dansal",
    title: "Herbal Drink (Belimal) & Jaggery Dansala",
    description: "Refreshing hot Belimal herbal tea served with pieces of local jaggery. Perfect stop for walkers.",
    area_name: "Kandy Lake Round",
    address_text: "Near Temple of the Tooth entrance, Kandy",
    latitude: 7.2911,
    longitude: 80.6418,
    start_date: "2026-05-30",
    end_date: "2026-06-01",
    time_text: "3:00 PM - 8:00 PM daily",
    trust_status: "community_confirmed",
    strong_confirm_count: 4,
    weak_confirm_count: 1,
    report_count: 0,
    created_at: new Date(Date.now() - 86400000).toISOString()
  }
];

// Helper to interact with LocalStorage
const getLocalStoragePlaces = (): MockPlace[] => {
  if (typeof window === 'undefined') return SEED_PLACES;
  try {
    const data = localStorage.getItem('vesak_mock_places');
    if (!data) {
      localStorage.setItem('vesak_mock_places', JSON.stringify(SEED_PLACES));
      return SEED_PLACES;
    }
    return JSON.parse(data);
  } catch (e) {
    return SEED_PLACES;
  }
};

const saveLocalStoragePlaces = (places: MockPlace[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('vesak_mock_places', JSON.stringify(places));
  } catch (e) {
    console.error(e);
  }
};

const getLocalStorageUsers = (): MockUser[] => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem('vesak_mock_users');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

const saveLocalStorageUsers = (users: MockUser[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('vesak_mock_users', JSON.stringify(users));
  } catch (e) {
    console.error(e);
  }
};

export const mockDb = {
  getPlaces: async (): Promise<MockPlace[]> => {
    return getLocalStoragePlaces();
  },

  getPlaceById: async (id: string): Promise<MockPlace | null> => {
    const places = getLocalStoragePlaces();
    return places.find(p => p.id === id) || null;
  },

  addPlace: async (placeData: Omit<MockPlace, 'id' | 'trust_status' | 'strong_confirm_count' | 'weak_confirm_count' | 'report_count' | 'created_at'>): Promise<MockPlace> => {
    const places = getLocalStoragePlaces();
    const newPlace: MockPlace = {
      ...placeData,
      id: `mock-${Math.random().toString(36).substr(2, 9)}`,
      trust_status: 'new',
      strong_confirm_count: 0,
      weak_confirm_count: 0,
      report_count: 0,
      created_at: new Date().toISOString()
    };
    places.unshift(newPlace);
    saveLocalStoragePlaces(places);
    return newPlace;
  },

  confirmPlace: async (placeId: string, type: string, isNearby: boolean): Promise<MockPlace | null> => {
    const places = getLocalStoragePlaces();
    const placeIndex = places.findIndex(p => p.id === placeId);
    if (placeIndex === -1) return null;

    const place = places[placeIndex];
    if (isNearby) {
      place.strong_confirm_count += 1;
    } else {
      place.weak_confirm_count += 1;
    }

    place.last_confirmed_at = new Date().toISOString();
    
    // Recalculate trust status
    place.trust_status = recalculateTrust(place.strong_confirm_count, place.weak_confirm_count, place.report_count);
    
    places[placeIndex] = place;
    saveLocalStoragePlaces(places);
    return place;
  },

  reportPlace: async (placeId: string, reason: string): Promise<MockPlace | null> => {
    const places = getLocalStoragePlaces();
    const placeIndex = places.findIndex(p => p.id === placeId);
    if (placeIndex === -1) return null;

    const place = places[placeIndex];
    place.report_count += 1;
    place.last_reported_at = new Date().toISOString();

    // Recalculate trust status
    place.trust_status = recalculateTrust(place.strong_confirm_count, place.weak_confirm_count, place.report_count);

    places[placeIndex] = place;
    saveLocalStoragePlaces(places);
    return place;
  },

  loginOrSignup: async (name: string, mobileNumber: string): Promise<MockUser> => {
    const users = getLocalStorageUsers();
    let user = users.find(u => u.mobile_number === mobileNumber);
    if (!user) {
      user = {
        id: `user-${Math.random().toString(36).substr(2, 9)}`,
        name,
        mobile_number: mobileNumber,
        display_name: name,
        is_blocked: false,
        created_at: new Date().toISOString()
      };
      users.push(user);
      saveLocalStorageUsers(users);
    }
    return user;
  }
};

function recalculateTrust(strong: number, weak: number, reports: number): MockPlace['trust_status'] {
  if (reports >= 5 && strong < 2) {
    return 'hidden_by_community';
  } else if (reports >= 3 && reports > strong) {
    return 'likely_wrong';
  } else if (reports >= 2) {
    return 'disputed';
  } else if (strong >= 8) {
    return 'highly_confirmed';
  } else if (strong >= 3) {
    return 'community_confirmed';
  } else {
    return 'new';
  }
}
