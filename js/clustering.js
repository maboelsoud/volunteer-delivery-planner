// clustering.js

function approxDistance(a, b) {
    const dx = (a.lat - b.lat) * 111; // km per degree latitude
    const dy = (a.lng - b.lng) * 85;  // km per degree longitude
    return Math.sqrt(dx * dx + dy * dy);
  }
  
  function clusterAddresses(addresses, volunteerCapacities) {
    const groupedByCity = {};
  
    // Step 1: Group addresses by city
    for (const addr of addresses) {
      let city = addr.city || "Unknown";
      if (!groupedByCity[city]) groupedByCity[city] = [];
      groupedByCity[city].push(addr);
    }
    console.log("🚀 ~ clusterAddresses ~ groupedByCity:", groupedByCity)
  
    const allRoutes = [];
    let volIndex = 0;
    // let extraRoutes = [];
  
    // Step 2: Cluster each city group
    for (let [city, cityAddresses] of Object.entries(groupedByCity)) {
      let unassigned = [...cityAddresses];
  

      let {
        route,
        extras,
      } = buildRoute(cityAddresses, Math.min(volunteerCapacities[volIndex], 10))
        // console.log("🚀 ~ clusterAddresses ~ route:", route)
      
      allRoutes.push({
        volunteerName: `Volunteer ${volIndex + 1}`,
        volunteerPhone: "",
        city,
        addresses: route
      });
      // volIndex++;

      // extraRoutes.push(...extras);

      allRoutes.push(...extras.map((x,i)=> ({
          volunteerName: `Extra #${i + 1} (${city})`,
          volunteerPhone: "",
          city,
          addresses: [x]
      })))
      
      // while (unassigned.length > 0 && volIndex < volunteerCapacities.length) {
      //   const cap = Math.min(volunteerCapacities[volIndex], 10); // enforce max 10 stops
      //   const route = [];
  
      //   // Start with one address
      //   route.push(unassigned.shift());
  
      //   // Greedily assign closest remaining addresses
      //   while (route.length < cap && unassigned.length > 0) {
      //     const last = route[route.length - 1];
      //     let closestIdx = 0;
      //     let minDist = Infinity;
  
      //     for (let i = 0; i < unassigned.length; i++) {
      //       const dist = approxDistance(last, unassigned[i]);
      //       if (dist < minDist) {
      //         minDist = dist;
      //         closestIdx = i;
      //       }
      //     }
  
      //     route.push(unassigned[closestIdx]);
      //     unassigned.splice(closestIdx, 1);
      //   }

      
  
      //   allRoutes.push({
      //     volunteerName: `Volunteer ${volIndex + 1}`,
      //     volunteerPhone: "",
      //     city,
      //     addresses: route
      //   });
  
      //   volIndex++;
      // }
  
      // Step 3: Create "Extra" routes for leftovers
      // for (let i = 0; i < unassigned.length; i++) {
      //   allRoutes.push({
      //     volunteerName: `Extra #${i + 1} (${city})`,
      //     volunteerPhone: "",
      //     city,
      //     addresses: [unassigned[i]]
      //   });
      // }
    }
  
    return allRoutes;
  }

  function buildRoute(addresses, cap) {
    let unassigned = [...addresses];
    const route = [];
    // Start with one address
    route.push(unassigned.shift());

    // Greedily assign closest remaining addresses
    while (route.length < cap && unassigned.length > 0) {
      const last = route[route.length - 1];
      let closestIdx = 0;
      let minDist = Infinity;

      for (let i = 0; i < unassigned.length; i++) {
        const dist = approxDistance(last, unassigned[i]);
        if (dist < minDist) {
          minDist = dist;
          closestIdx = i;
        }
      }

      route.push(unassigned[closestIdx]);
      unassigned.splice(closestIdx, 1);
    }

    return {
      route,
      extras: unassigned,
    }

  }

  // function createExtraRoutes(addresses) {
  //     for (let i = 0; i < unassigned.length; i++) {
  //       allRoutes.push({
  //         volunteerName: `Extra #${i + 1} (${city})`,
  //         volunteerPhone: "",
  //         city,
  //         addresses: [unassigned[i]]
  //       });
  //     }
  // }