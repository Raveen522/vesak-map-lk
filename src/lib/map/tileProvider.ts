export const tileProvider = {
  url:
    process.env.NEXT_PUBLIC_MAP_TILE_URL ||
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution:
    process.env.NEXT_PUBLIC_MAP_ATTRIBUTION ||
    '© OpenStreetMap contributors',
};

export const defaultMapConfig = {
  center: [
    parseFloat(process.env.NEXT_PUBLIC_DEFAULT_LAT || '7.8731'),
    parseFloat(process.env.NEXT_PUBLIC_DEFAULT_LNG || '80.7718'),
  ] as [number, number],
  zoom: parseInt(process.env.NEXT_PUBLIC_DEFAULT_ZOOM || '8', 10),
};
