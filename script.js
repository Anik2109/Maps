document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.querySelector('.search-button');
    const searchBar = document.querySelector('.search-bar');
    const micButton = document.getElementById('micButton');
    const mapContainer = document.querySelector('.leaflet-container');

     // Function to make the map fullscreen
     function makeMapFullscreen() {
        mapElement.classList.add('fullscreen-map');
        searchSection.classList.add('fullscreen');
    }
    // Search button functionality
    searchButton.addEventListener('click', () => {
        const query = searchBar.value;
        if (query) {
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
                .then(response => response.json())
                .then(data => {
                    if (data && data.length > 0) {
                        const { lat, lon, display_name } = data[0];
                        map.setView([lat, lon], 15);
                        L.marker([lat, lon]).addTo(map).bindPopup(display_name).openPopup();
                    } else {
                        alert('Location not found');
                    }
                });
        } else {
            alert('Please enter a search term');
        }
    });

    // Option buttons functionality
    const optionButtons = document.querySelectorAll('.option-button');
    optionButtons.forEach(button => {
        button.addEventListener('click', () => {
            alert(`Option selected: ${button.textContent}`);
        });
    });

    // Microphone button functionality using Web Speech API
    micButton.addEventListener('click', () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert('Your browser does not support Speech Recognition. Please use Google Chrome.');
            return;
        }

        const recognition = new webkitSpeechRecognition();
        recognition.lang = 'en-US'; // Set the language for recognition
        recognition.interimResults = false; // Set to true if you want to show interim results

        recognition.start();

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            searchBar.value = transcript; // Optionally set the search bar to the recognized text
            alert(`Recognized: ${transcript}`);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            alert('Error recognizing speech.');
        };

        recognition.onend = () => {
            console.log('Speech recognition service disconnected');
        };
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
