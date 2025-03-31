// geocoding-google.js

const GEOCODE_CACHE_KEY = "geocode-cache-google";
const GEOCODE_QUEUE = [];
let isGeocoding = false;

let geocodeCache = JSON.parse(localStorage.getItem(GEOCODE_CACHE_KEY) || "{}");

function saveGeocodeCache() {
  localStorage.setItem(GEOCODE_CACHE_KEY, JSON.stringify(geocodeCache));
}

function throttleGeocodeQueue() {
  if (isGeocoding || GEOCODE_QUEUE.length === 0) return;

  isGeocoding = true;
  const { address, resolve, reject } = GEOCODE_QUEUE.shift();

  fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=AIzaSyD9bDKziTaCch3My5RzdAFTDx-mo03mt9s`
  )
    .then(res => res.json())
    .then(data => {
      if (data.status !== "OK" || data.results.length === 0) {
        reject(new Error("Geocoding failed: " + data.status));
        return;
      }

      const best = data.results[0];

      const cityComponent = best.address_components.find(comp =>
        comp.types.includes("locality") ||
        comp.types.includes("administrative_area_level_2") 
        // ||  // fallback to regional district
        // comp.types.includes("postal_town") ||
        // comp.types.includes("sublocality") ||
        // comp.types.includes("neighborhood")
      );

      const city = cityComponent?.long_name || "Unknown";

      const parsed = {
        address,
        lat: best.geometry.location.lat,
        lng: best.geometry.location.lng,
        display_name: best.formatted_address,
        city
      };

      geocodeCache[address] = parsed;
      saveGeocodeCache();
      resolve(parsed);
    })
    .catch(err => {
      reject(err);
    })
    .finally(() => {
      isGeocoding = false;
      setTimeout(throttleGeocodeQueue, 1000); // 1 second delay between requests
    });
}

function geocodeAddress(address) {
  if (geocodeCache[address]) {
    return Promise.resolve(geocodeCache[address]);
  }

  return new Promise((resolve, reject) => {
    GEOCODE_QUEUE.push({ address, resolve, reject });
    throttleGeocodeQueue();
  });
}