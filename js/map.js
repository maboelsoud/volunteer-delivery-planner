let map;
let routeOverlays = [];
let currentRouteIndex = null;

const ROUTE_COLORS = [
    "#e6194b", "#3cb44b", "#ffe119", "#4363d8", "#f58231",
    "#911eb4", "#46f0f0", "#f032e6", "#bcf60c", "#fabebe",
    "#008080", "#e6beff", "#9a6324", "#fffac8", "#800000",
    "#aaffc3", "#808000", "#ffd8b1", "#000075", "#808080"
];

function initMap() {
    map = new google.maps.Map(document.getElementById("app"), {
        center: { lat: 43.6, lng: -79.6 }, // Mississauga-ish
        zoom: 11,
        mapTypeControl: false
    });
}
window.initMap = initMap // for google api call

function clearMap() {
    for (const overlay of routeOverlays) {
        if (overlay.polyline) overlay.polyline.setMap(null);
        if (overlay.markers) {
            overlay.markers.forEach(m => m.setMap(null));
        }
    }
    routeOverlays = [];
}

function renderRoutesOnMap(routes) {
    clearMap();

    const bounds = new google.maps.LatLngBounds();

    routes.forEach((route, index) => {
        const color = ROUTE_COLORS[index % ROUTE_COLORS.length];
        const path = route.addresses.map(a => ({ lat: a.lat, lng: a.lng }));

        // Draw polyline
        const polyline = new google.maps.Polyline({
            path,
            strokeColor: color,
            strokeOpacity: 1.0,
            strokeWeight: 4,
            map
        });

        // Draw numbered markers
        const markers = route.addresses.map((a, i) => {
            const marker = new google.maps.Marker({
                position: { lat: a.lat, lng: a.lng },
                label: `${i + 1}`,
                map
            });
            return marker;
        });

        polyline.addListener("click", () => zoomToRoute(route));

        routeOverlays.push({ polyline, markers });

        // Expand global bounds to fit this route
        path.forEach(p => bounds.extend(p));
    });

    // Fit map to all routes
    map.fitBounds(bounds);
}

function zoomToRoute(route) {
    const bounds = new google.maps.LatLngBounds();
    route.addresses.forEach(a => bounds.extend({ lat: a.lat, lng: a.lng }));
    map.fitBounds(bounds);
}