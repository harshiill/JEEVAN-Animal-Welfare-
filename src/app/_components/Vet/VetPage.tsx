'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';

function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

interface Vet {
  name: string;
  address: string;
  longitude: number;
  latitude: number;
  distance: number;
}

export default function VetLocatorPage() {
  const [vets, setVets] = useState<Vet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [radius, setRadius] = useState<number>(10);

  const searchTerms = useMemo(
    () => ['veterinary', 'vet', 'animal hospital', 'pet care', 'pet hospital'],
    []
  );

  const fetchVets = useCallback(
    async (lat: number, lon: number, radiusKm: number) => {
      setLoading(true);
      setError(null);

      try {
        const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
        if (!token) {
          throw new Error('Mapbox token is missing');
        }

        const allResults: Vet[] = [];

        for (const term of searchTerms) {
          const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(term)}.json?proximity=${lon},${lat}&limit=10&access_token=${token}`;
          const res = await fetch(url);
          const data = await res.json();

          const results: Vet[] = data.features.map((place: any) => {
            const placeLat = place.geometry.coordinates[1];
            const placeLon = place.geometry.coordinates[0];
            const distance = getDistanceKm(lat, lon, placeLat, placeLon);
            return {
              name: place.text,
              address: place.place_name,
              longitude: placeLon,
              latitude: placeLat,
              distance: parseFloat(distance.toFixed(2)),
            };
          });

          allResults.push(...results);
        }

        const uniqueResults = Array.from(
          new Map(allResults.map((item) => [item.address, item])).values()
        );

        const filtered = uniqueResults
          .filter((vet) => vet.distance <= radiusKm)
          .sort((a, b) => a.distance - b.distance);

        setVets(filtered);
      } catch (err) {
        console.error('Error fetching vets:', err);
        setError('Failed to fetch vet clinics.');
      }

      setLoading(false);
    },
    [searchTerms]
  );

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setUserLocation({ latitude: lat, longitude: lon });
        fetchVets(lat, lon, radius);
      },
      (geoError) => {
        console.error('Geolocation error:', geoError);
        setError('Unable to retrieve your location. Please allow location access.');
      }
    );
  }, [fetchVets, radius]);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  useEffect(() => {
    if (userLocation) {
      fetchVets(userLocation.latitude, userLocation.longitude, radius);
    }
  }, [userLocation, radius, fetchVets]);

  return (
    <main className="min-h-screen w-full bg-white text-[#000000] font-sans px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-10">Nearby Veterinary Clinics</h1>

        <div className="flex flex-wrap items-center gap-4 mb-8 text-lg">
          <label className="font-medium text-gray-700">
            Radius:&nbsp;
            <select
              className="border border-gray-300 rounded px-4 py-2 text-base"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
            >
              {[5, 10, 20, 50, 100, 500, 1000, 5000].map((km) => (
                <option key={km} value={km}>
                  {km} km
                </option>
              ))}
            </select>
          </label>

          <button
            onClick={getLocation}
            className="bg-[#00C4B4] text-white px-5 py-2 rounded-full hover:bg-[#00a89d] text-base font-semibold"
          >
            📍 Refresh Location
          </button>
        </div>

        {userLocation && (
          <div className="bg-blue-50 border border-blue-300 text-blue-800 rounded-lg p-6 mb-8 text-base">
            <h2 className="font-semibold text-lg mb-2">📍 Your Location:</h2>
            <p>Latitude: {userLocation.latitude.toFixed(5)}</p>
            <p>Longitude: {userLocation.longitude.toFixed(5)}</p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${userLocation.latitude},${userLocation.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-blue-600 underline"
            >
              View on Google Maps
            </a>
          </div>
        )}

        {loading && <p className="text-gray-500 text-lg">🔍 Searching nearby vets...</p>}
        {error && <p className="text-red-500 text-lg">{error}</p>}
        {!loading && vets.length === 0 && !error && (
          <p className="text-gray-600 text-lg italic">No vet clinics found within {radius} km.</p>
        )}

        <ul className="space-y-6">
          {vets.map((vet, idx) => (
            <li key={idx} className="border rounded-lg p-6 shadow text-lg bg-white">
              <h2 className="text-xl font-semibold mb-1">{vet.name}</h2>
              <p className="text-gray-700 mb-1">📍 {vet.address}</p>
              <p className="text-gray-600 mb-2">📏 Distance: {vet.distance} km</p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${vet.latitude},${vet.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline font-medium"
              >
                Open in Google Maps
              </a>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}