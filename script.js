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
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    const satelliteLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.opentopomap.org/">OpenTopoMap</a> contributors'
    });

    const terrainLayer = L.tileLayer('https://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.jpg', {
        attribution: 'Map tiles by <a href="https://stamen.com/">Stamen Design</a>, under <a href="https://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="https://openstreetmap.org">OpenStreetMap</a>, under ODbL.'
    });

    // Create map
    const map = L.map('map', {
        center: [51.505, -0.09],
        zoom: 13,
        layers: [streetLayer]
    });

    // Layer control
    const baseLayers = {
        'Street': streetLayer,
        'Satellite': satelliteLayer,
        'Terrain': terrainLayer
    };

    L.control.layers(baseLayers).addTo(map);

    // Add scale control
    L.control.scale().addTo(map);

    // Add geolocation control to locate the user
    L.control.locate().addTo(map);
});
