// clustering.js

function approxDistance(a, b) {
    const dx = (a.lat - b.lat) * 111; // rough km per degree lat
    const dy = (a.lng - b.lng) * 85;  // rough km per degree lng
    return Math.sqrt(dx * dx + dy * dy);
  }
  
  function clusterAddresses(addresses, volunteerCapacities) {
    const groupedByCity = {};
  
    // Step 1: Group addresses by city
    for (const addr of addresses) {
      const city = addr.city || "Unknown";
      if (!groupedByCity[city]) groupedByCity[city] = [];
      groupedByCity[city].push(addr);
    }
  
    const allRoutes = [];
    let volIndex = 0;
  
    // Step 2: For each city, assign routes
    for (const [city, cityAddresses] of Object.entries(groupedByCity)) {
      let unassigned = [...cityAddresses];
  
      while (unassigned.length > 0 && volIndex < volunteerCapacities.length) {
        const cap = Math.min(volunteerCapacities[volIndex], 10); // enforce max 10 stops
        const route = [];
  
        // Start with one address
        route.push(unassigned.shift());
  
        // Greedily assign closest remaining addresses
        while (route.length < cap && unassigned.length > 0) {
          const last = route[route.length - 1];
          let closestIdx = 0;
          let minDist = Infinity;
  
          for (let i = 0; i < unassigned.length; i++) {
            const d = approxDistance(last, unassigned[i]);
            if (d < minDist) {
              minDist = d;
              closestIdx = i;
            }
          }
  
          route.push(unassigned[closestIdx]);
          unassigned.splice(closestIdx, 1);
        }
  
        allRoutes.push({
          name: `Volunteer ${volIndex + 1}`,
          city,
          addresses: route
        });
  
        volIndex++;
      }
  
      // Step 3: Assign remaining as extras
      for (let i = 0; i < unassigned.length; i++) {
        allRoutes.push({
          name: `Extra #${i + 1} (${city})`,
          city,
          addresses: [unassigned[i]]
        });
      }
    }
  
    return allRoutes;
  }