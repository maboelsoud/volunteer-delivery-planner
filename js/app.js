// app.js

function App() {
    const [routes, setRoutes] = React.useState([]);

    // Define the generate routes function
    const onGenerateRoutes = async (addressInput, volunteerBags) => {
        await handleGenerateRoutes(addressInput, volunteerBags, setRoutes);
    };

    return (
      <div style={{ display: "flex", height: "100vh" }}>
        <Sidebar routes={routes} onGenerateRoutes={onGenerateRoutes} />
        {/* Map fills rest of screen */}
        <div id="map" style={{ flex: 1 }}></div>
      </div>
    );
  }
  
  const domnode = ReactDOM.createRoot(document.getElementById("app"));
  domnode.render(<App />);