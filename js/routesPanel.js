  function RoutesPanel({ routes }) {
    return (
      <div style={{ maxHeight: "90vh", overflowY: "scroll", padding: "10px" }}>
        {routes.map((route, i) => (
          <RouteCard key={i} route={route} />
        ))}
      </div>
    );
  }