// share.js

function buildWhatsAppMessage(route) {
  const name = route.volunteerName || "Volunteer";
  let message = `Hi ${name}! Please deliver to the following addresses:\n\n`;

  route.addresses.forEach((addr, i) => {
    const clean = addr.display_name || addr.address;
    const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clean)}`;
    message += `${i + 1}. ${clean}\n${mapsLink}\n\n`;
  });

  // Google Maps directions with waypoints
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
  const phone = phoneNumber.replace(/\D/g, "");
  return `https://wa.me/${phone}?text=${encoded}`;
}

function buildQRUrl(waLink) {
  return `https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=${encodeURIComponent(waLink)}`;
}

function ShareModal({ route, onClose }) {
  const [phone, setPhone] = React.useState(route.volunteerPhone || "");

  const waLink = buildWhatsAppLink(phone, route);
  const qrUrl = buildQRUrl(waLink);

  const saveAndClose = () => {
    route.volunteerPhone = phone;
    onClose(); // remove modal
  };

  return (
    <div style={{
      position: "fixed",
      top: "50%", left: "50%",
      transform: "translate(-50%, -50%)",
      padding: "20px",
      backgroundColor: "white",
      border: "1px solid #ccc",
      zIndex: 9999
    }}>
      <h3>Share route with {route.volunteerName}</h3>
      <p>Scan the QR code or click the link to open WhatsApp:</p>
      <img src={qrUrl} alt="QR Code" style={{ marginBottom: "10px" }} />
      <br />
      <a href={waLink} target="_blank" rel="noopener noreferrer">
        Open WhatsApp Message
      </a>
      <br /><br />
      <label>Phone number (with country code):</label>
      <input
        type="tel"
        placeholder="e.g. 14165551234"
        value={phone}
        onChange={e => setPhone(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />
      <div>
        <button onClick={saveAndClose}>Save + Close</button>
      </div>
    </div>
  );
}