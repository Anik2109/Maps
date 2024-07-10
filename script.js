document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.querySelector('.search-button');
    const searchBar = document.querySelector('.search-bar');
    const micButton = document.getElementById('micButton');

    searchButton.addEventListener('click', () => {
        alert(`Searching for: ${searchBar.value}`);
    });

    const optionButtons = document.querySelectorAll('.option-button');
    optionButtons.forEach(button => {
        button.addEventListener('click', () => {
            alert(`Option selected: ${button.textContent}`);
        });
    });

    // Microphone button interactivity
    micButton.addEventListener('click', () => {
        alert('Microphone button clicked');
        // Add logic to start/stop recording or any other microphone functionality
    });

    // Base layers
    const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    });

    const satelliteLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenTopoMap contributors'
    });

    const terrainLayer = L.tileLayer('https://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=your-api-key', {
        attribution: '© Thunderforest contributors'
    });

    // Initialize the map
    const map = L.map('map', {
        center: [51.505, -0.09],
        zoom: 13,
        layers: [streetLayer]
    });

    // Base maps
    const baseMaps = {
        "Street": streetLayer,
        "Satellite": satelliteLayer,
        "Terrain": terrainLayer
    };

    // Add control for base maps
    L.control.layers(baseMaps).addTo(map);

    // Locate the user's position and set the map view to it
    map.locate({ setView: true, maxZoom: 16 });

    // Handle location found event
    function onLocationFound(e) {
        const radius = e.accuracy / 2;
        L.marker(e.latlng).addTo(map)
            .bindPopup(`You are within ${radius} meters from this point`).openPopup();
        L.circle(e.latlng, radius).addTo(map);
    }

    // Handle location error event
    function onLocationError(e) {
        alert(e.message);
    }

    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);
});
