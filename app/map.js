// Copyright (c) Daniel W. Steinbrook.
// with many thanks to ChatGPT

export function createMap(id) {
  var map = L.map(id);

  // initialize OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // Create a custom divIcon with rotation
  var arrowIcon = L.divIcon({
    className: 'arrow-icon',
    iconSize: [0, 0], // set size to 0, as it's controlled by CSS
    iconAnchor: [7, 25] // adjust anchor based on the arrow design
  });

  var markersLayer = new L.LayerGroup().addTo(map);

  map.plotPoints = function(points, radiusMeters) {
    // Clear existing markers
    markersLayer.clearLayers();

    // Plot each point on the map
    points.forEach(function(point) {
      // Render a circle reflecting the radius of POIs within speaking distance
      L.circle([point.latitude, point.longitude], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: radiusMeters  // drawn radius is based on proximity threshold for callouts
      }).addTo(markersLayer);

      // Also render a directional arrow showing inferred compass heading
      var arrowMarker = L.marker([point.latitude, point.longitude], {
        icon: arrowIcon,
      }).addTo(markersLayer);
      arrowMarker._icon.style.transform += ' rotate(' + point.heading + 'deg)';
    });
  };

  return map;
}