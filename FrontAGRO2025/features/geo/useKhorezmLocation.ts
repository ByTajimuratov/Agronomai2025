
import { useState, useEffect } from 'react';

export const KHOREZM_BOUNDS = {
  minLat: 40.0, // Slightly wider buffer for demo
  maxLat: 43.0,
  minLng: 59.0,
  maxLng: 63.0
};

// Fail-Safe Default: Urgench, Uzbekistan
const DEFAULT_COORDS = { lat: 41.5567, lng: 60.6314 };

interface LocationState {
  coords: { lat: number; lng: number } | null;
  inKhorezm: boolean | null; // null = checking
  error: string | null;
  loading: boolean;
}

export const useKhorezmLocation = () => {
  const [locationState, setLocationState] = useState<LocationState>({
    coords: null,
    inKhorezm: null,
    error: null,
    loading: true
  });

  const checkLocation = () => {
    setLocationState(prev => ({ ...prev, loading: true, error: null }));

    // Strategy: Fail-Safe Fallback
    const applyDefaultLocation = () => {
        console.warn("Geolocation unavailable/timed out. Using Fail-Safe Default (Urgench).");
        setLocationState({
            coords: DEFAULT_COORDS,
            inKhorezm: true, // Allow access automatically
            error: null,     // Clear error to prevent blocking
            loading: false
        });
    };

    if (!navigator.geolocation) {
      applyDefaultLocation();
      return;
    }

    // 1. Set Strict 5-Second Timeout
    const timeoutId = setTimeout(() => {
        applyDefaultLocation();
    }, 5000);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Success: Clear timeout
        clearTimeout(timeoutId);
        
        const { latitude, longitude } = position.coords;
        
        // Strict Khorezm Geofencing Logic (Only applied if we have REAL verified coords)
        const isInside = 
          latitude >= KHOREZM_BOUNDS.minLat &&
          latitude <= KHOREZM_BOUNDS.maxLat &&
          longitude >= KHOREZM_BOUNDS.minLng &&
          longitude <= KHOREZM_BOUNDS.maxLng;

        if (isInside) {
            setLocationState({
              coords: { lat: latitude, lng: longitude },
              inKhorezm: true,
              error: null,
              loading: false
            });
        } else {
            // Block user ONLY if they are verified to be outside
            setLocationState({
              coords: { lat: latitude, lng: longitude },
              inKhorezm: false,
              error: "Service Unavailable: You are outside the Khorezm Region.",
              loading: false
            });
        }
      },
      (err) => {
        // Error / Permission Denied: Clear timeout and use default
        clearTimeout(timeoutId);
        console.warn("Geolocation error:", err.message);
        applyDefaultLocation();
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 60000 }
    );
  };

  // Initial check
  useEffect(() => {
    checkLocation();
  }, []);

  return { ...locationState, retry: checkLocation };
};
