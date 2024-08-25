document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');
    const searchButton = document.querySelector('.search-button');
    const searchBar = document.querySelector('.search-bar');
    const micButton = document.getElementById('micButton');
    const fullscreenMapContainer = document.getElementById('fullscreen-map-container');

    let fullscreenMap;

    // Initialize the full-screen map
    function initializeFullscreenMap() {
        // Ensure the map container is visible
        fullscreenMapContainer.style.display = 'block';

        // Initialize the map only if it hasn't been initialized yet
        if (!fullscreenMap) {
            fullscreenMap = L.map(fullscreenMapContainer).setView([51.505, -0.09], 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(fullscreenMap);
        }
    }

    // Function to search for a location on the map
    function searchLocation(query, map) {
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
            })
            .catch(error => console.error('Error fetching location:', error));
    }

    // Search button functionality
    searchButton.addEventListener('click', () => {
        const query = searchBar.value;
        if (query) {
            initializeFullscreenMap();
            searchLocation(query, fullscreenMap);
        } else {
            alert('Please enter a search term');
        }
    });

    // Set the search bar value from URL parameter
    if (query) {
        searchBar.value = query;
        initializeFullscreenMap();
        searchLocation(query, fullscreenMap);
    }

    // Microphone button functionality using Web Speech API
    micButton.addEventListener('click', () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert('Your browser does not support Speech Recognition. Please use Google Chrome.');
            return;
        }

        const recognition = new webkitSpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;

        recognition.start();

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            searchBar.value = transcript;
            initializeFullscreenMap();
            searchLocation(transcript, fullscreenMap);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            alert('Error recognizing speech.');
        };

        recognition.onend = () => {
            console.log('Speech recognition service disconnected');
        };
    });
});
