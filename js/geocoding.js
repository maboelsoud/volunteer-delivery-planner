let geocodeQueue = Promise.resolve(); // Ensures one-at-a-time execution

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getFromCache(address) {
  const cache = JSON.parse(localStorage.getItem("geocodeCache") || "{}");
  const entry = cache[address];
  if (!entry) return null;
  return {
    ...entry,
    lat: parseFloat(entry.lat),
    lng: parseFloat(entry.lng)
  };
}

function saveToCache(address, result) {
  const cache = JSON.parse(localStorage.getItem("geocodeCache") || "{}");
  cache[address] = result;
  localStorage.setItem("geocodeCache", JSON.stringify(cache));
}

function geocodeAddress_legacy(address) {
  const cached = getFromCache(address);
  if (cached) return Promise.resolve(cached);

  // Add to the end of the queue
  geocodeQueue = geocodeQueue.then(async () => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "ramadan-giving-app",
        "Referer": location.origin
      }
    });

    const data = await res.json();
    if (!data.length) throw new Error("No results for: " + address);

    const best = data[0];
    const parsed = {
      address,
      lat: parseFloat(best.lat),
      lng: parseFloat(best.lon),
      display_name: best.display_name,
      city: best.address.city || best.address.town || best.address.village || best.address.suburb || "Unknown"
    };

    saveToCache(address, parsed);
    await delay(1000); // Enforce 1-second gap between requests

    return parsed;
  });

  return geocodeQueue;
}