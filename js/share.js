function buildWhatsAppMessage(route) {
    let message = `Hi ${route.name}! Please deliver to the following addresses:\n\n`;
  
    route.addresses.forEach((addr, i) => {
      const clean = addr.display_name || addr.address;
      const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clean)}`;
      message += `${i + 1}. ${clean}\n${mapsLink}\n\n`;
    });
  
    // Build Google Maps Directions route
    const points = route.addresses.map(a => encodeURIComponent(a.display_name || a.address));
    if (points.length >= 2) {
      const origin = points[0];
      const destination = points[points.length - 1];
      const waypoints = points.slice(1, -1).join("|");
      const directionsLink = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${waypoints}`;
  
      message += `Combined navigation route:\n${directionsLink}`;
    }
  
    return message;
  }
  
  function buildWhatsAppLink(phoneNumber, route) {
    const message = buildWhatsAppMessage(route);
    const encoded = encodeURIComponent(message);
    return `https://wa.me/${phoneNumber}?text=${encoded}`;
  }
  
  function buildQRUrl(whatsappLink) {
    return `https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=${encodeURIComponent(whatsappLink)}`;
  }
  
  // Used to populate modal or route details panel
  function showShareOptions(route) {
    const defaultNumber = "1XXXXXXXXXX"; // placeholder for testing
    const waLink = buildWhatsAppLink(defaultNumber, route);
    const qrUrl = buildQRUrl(waLink);
  
    const container = document.createElement("div");
    container.innerHTML = `
      <h3>Share route with ${route.name}</h3>
      <p>You can scan the QR code or click the link to open WhatsApp:</p>
      <img src="${qrUrl}" alt="QR Code" style="margin-bottom: 10px;" />
      <br/>
      <a href="${waLink}" target="_blank">Open WhatsApp Message</a>
      <br/><br/>
      <label>To use a specific number:</label>
      <input type="tel" id="wa-number-input" placeholder="e.g. 14165551234" />
      <button onclick="regenerateShareLink('${route.name.replace(/'/g, "\\'")}')">Update QR + Link</button>
    `;
  
    const modal = document.createElement("div");
    modal.id = "share-modal";
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.padding = "20px";
    modal.style.backgroundColor = "white";
    modal.style.border = "1px solid #ccc";
    modal.style.zIndex = 9999;
    modal.appendChild(container);
  
    const closeBtn = document.createElement("button");
    closeBtn.innerText = "Close";
    closeBtn.style.marginTop = "10px";
    closeBtn.onclick = () => modal.remove();
    modal.appendChild(closeBtn);
  
    document.body.appendChild(modal);
  }
  
  function regenerateShareLink(routeName) {
    const input = document.getElementById("wa-number-input");
    const number = input.value.trim().replace(/\D/g, "");
    const route = window.allRoutes.find(r => r.name === routeName);
    if (!route || !number) return;
  
    const newLink = buildWhatsAppLink(number, route);
    const newQR = buildQRUrl(newLink);
  
    const modal = document.getElementById("share-modal");
    modal.querySelector("a").href = newLink;
    modal.querySelector("img").src = newQR;
  }