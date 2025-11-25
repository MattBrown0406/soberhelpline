import zipcodes from 'zipcodes';

interface ZipCodeLocation {
  lat: number;
  lng: number;
  city: string;
  state: string;
}

// Get location data from a zip code
export function getZipCodeLocation(zipCode: string): ZipCodeLocation | null {
  const location = zipcodes.lookup(zipCode);
  if (!location) return null;
  
  return {
    lat: location.latitude,
    lng: location.longitude,
    city: location.city,
    state: location.state,
  };
}

// Calculate distance between two points using Haversine formula (in miles)
export function calculateDistanceMiles(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Filter and sort providers by distance from a zip code
export function filterProvidersByDistance<T extends { zip_code: string | null }>(
  providers: T[],
  searchZipCode: string,
  radiusMiles: number = 100,
  fallbackCount: number = 3
): { providers: (T & { distance: number })[]; isNearby: boolean; searchLocation: ZipCodeLocation | null } {
  const searchLocation = getZipCodeLocation(searchZipCode);
  
  if (!searchLocation) {
    return { providers: [], isNearby: false, searchLocation: null };
  }

  // Calculate distance for each provider
  const providersWithDistance = providers
    .filter(provider => provider.zip_code)
    .map(provider => {
      const providerLocation = getZipCodeLocation(provider.zip_code!);
      if (!providerLocation) {
        return { ...provider, distance: Infinity };
      }
      
      const distance = calculateDistanceMiles(
        searchLocation.lat,
        searchLocation.lng,
        providerLocation.lat,
        providerLocation.lng
      );
      
      return { ...provider, distance };
    })
    .filter(provider => provider.distance !== Infinity)
    .sort((a, b) => a.distance - b.distance);

  // Get providers within radius
  const providersWithinRadius = providersWithDistance.filter(
    provider => provider.distance <= radiusMiles
  );

  if (providersWithinRadius.length > 0) {
    return { 
      providers: providersWithinRadius, 
      isNearby: false,
      searchLocation 
    };
  }

  // Fall back to closest providers if none within radius
  const closestProviders = providersWithDistance.slice(0, fallbackCount);
  
  return { 
    providers: closestProviders, 
    isNearby: closestProviders.length > 0,
    searchLocation 
  };
}
