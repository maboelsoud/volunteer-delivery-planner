// ui.js

function RouteCard({ route }) {
    const [name, setName] = React.useState(route.volunteerName || "");
    const [phone, setPhone] = React.useState(route.volunteerPhone || "");
  
    // Save back to the route object so ShareModal has access
    const save = () => {
      route.volunteerName = name;
      route.volunteerPhone = phone;
    };
  
    const openShareModal = () => {
      save();
      ReactDOM.render(
        <ShareModal
          route={route}
          onClose={() => {
            document.getElementById("share-container").innerHTML = "";
          }}
        />,
        document.getElementById("share-container")
      );
    };
  
    return (
      <div style={{
        border: "1px solid #ddd",
        padding: "10px",
        marginBottom: "10px",
        backgroundColor: "#f9f9f9"
      }}>
        <h4>{route.volunteerName}</h4>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <label>Phone:</label>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>
        <button onClick={openShareModal}>Share</button>
      </div>
    );
  }
  
  function RoutesPanel({ routes }) {
    return (
      <div style={{ maxHeight: "90vh", overflowY: "scroll", padding: "10px" }}>
        {routes.map((route, i) => (
          <RouteCard key={i} route={route} />
        ))}
      </div>
    );
  }