// app.js

function App() {
    const [addressInput, setAddressInput] = React.useState("");
    const [volunteerCount, setVolunteerCount] = React.useState(3);
    const [volunteerBags, setVolunteerBags] = React.useState([]);
    const [routes, setRoutes] = React.useState([]);
  
    // Update bag inputs dynamically when volunteer count changes
    React.useEffect(() => {
      const newBags = Array.from({ length: volunteerCount }, (_, i) =>
        volunteerBags[i] || 1
      );
      setVolunteerBags(newBags);
    }, [volunteerCount]);
  
    const handleGenerateRoutes = async () => {
      const rawAddresses = addressInput
        .split(/[\n\r\t,]+/)
        .map(a => a.trim())
        .filter(a => a.length > 0);
  
      const geocoded = [];
      for (const addr of rawAddresses) {
        try {
          const geo = await geocodeAddress(addr);
          geocoded.push(geo);
        } catch (e) {
          console.warn("Failed to geocode:", addr, e);
        }
      }
  
      const clustered = clusterAddresses(geocoded, volunteerBags);
      setRoutes(clustered);
      window.allRoutes = clustered; // for debugging or share.js
      renderRoutesOnMap(clustered); // update map
    };
  
    return (
      <div style={{ display: "flex", height: "100vh" }}>
        {/* Sidebar UI */}
        <div style={{ width: "400px", overflowY: "auto", padding: "10px", background: "#fff" }}>
          <h2>Ramadan Giving</h2>
  
          <label>Addresses:</label>
          <textarea
            value={addressInput}
            onChange={e => setAddressInput(e.target.value)}
            placeholder="Paste addresses here..."
            style={{ width: "100%", height: "100px" }}
          />
  
          <label>Number of Volunteers:</label>
          <input
            type="number"
            value={volunteerCount}
            onChange={e => setVolunteerCount(parseInt(e.target.value) || 0)}
            style={{ width: "100%" }}
          />
  
          <label>Bag capacity for each volunteer:</label>
          <div style={{ maxHeight: "150px", overflowY: "auto" }}>
            {volunteerBags.map((bags, i) => (
              <div key={i}>
                <label>Volunteer {i + 1}:</label>
                <input
                  type="number"
                  value={bags}
                  min="1"
                  max="10"
                  onChange={e => {
                    const copy = [...volunteerBags];
                    copy[i] = parseInt(e.target.value) || 1;
                    setVolunteerBags(copy);
                  }}
                  style={{ width: "60px", marginBottom: "5px" }}
                />
              </div>
            ))}
          </div>
  
          <button onClick={handleGenerateRoutes}>Generate Routes</button>
  
          <hr />
  
          <RoutesPanel routes={routes} />
        </div>
  
        {/* Map fills rest of screen */}
        <div id="map" style={{ flex: 1 }}></div>
      </div>
    );
  }
  
  ReactDOM.render(<App />, document.getElementById("app"));