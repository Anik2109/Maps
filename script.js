// Initialize the map
var map = L.map('map').setView([30.357237, 796.375603], 13);


// Add a tile layer (OpenStreetMap in this case)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

// Array to store the markers
var markers = [];

// Function to load GeoJSON data
function loadGeoJSON() {
    axios.get('data/pois.geojson')
        .then(function (response) {
            // Add GeoJSON layer to the map
            L.geoJSON(response.data, {
                onEachFeature: function (feature, layer) {
                    if (feature.properties && feature.properties.name) {
                        layer.bindPopup(feature.properties.name);
                    }
                    layer.on('click', function(e) {
                        removeMarker(e.target);
                    });
                }
            }).addTo(map);
        })
        .catch(function (error) {
            console.error('Error loading GeoJSON data:', error);
        });
}

// Load initial GeoJSON data
loadGeoJSON();

// Add an event listener for map clicks
map.on('click', function(e) {
    var lat = e.latlng.lat.toFixed(2);
    var lng = e.latlng.lng.toFixed(2);
    var marker = addMarker(e.latlng);
    marker.bindPopup("You clicked the map at latitude: " + lat + " and longitude: " + lng).openPopup();
});

// Show popup with message
function showPopup(message) {
    var popup = document.getElementById('popup');
    var popupContent = document.getElementById('popup-content');
    popupContent.textContent = message;
    popup.style.display = 'block';
}

// Close the popup
document.getElementById('popup-close').addEventListener('click', function() {
    var popup = document.getElementById('popup');
    popup.style.display = 'none';
});

// Add a marker to the map
function addMarker(latlng) {
    var marker = L.marker(latlng, { draggable: true }).addTo(map);
    markers.push(marker);
    marker.on('click', function() {
        removeMarker(marker);
    });
    return marker;
}

// Remove a marker from the map
function removeMarker(marker) {
    map.removeLayer(marker);
    var index = markers.indexOf(marker);
    if (index > -1) {
        markers.splice(index, 1);
    }
}

// Remove all markers from the map
function removeAllMarkers() {
    for (var i = 0; i < markers.length; i++) {
        map.removeLayer(markers[i]);
    }
    markers = [];
}

// Save markers to GeoJSON file
function saveGeoJSON() {
    var geojson = {
        type: "FeatureCollection",
        features: markers.map(function(marker) {
            return {
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [
                        marker.getLatLng().lng,
                        marker.getLatLng().lat
                    ]
                },
                properties: {}
            };
        })
    };
    
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(geojson));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "markers.geojson");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}
