document.addEventListener('DOMContentLoaded', () => {
    
    const searchButton = document.querySelector('.search-button');
    const searchBar = document.querySelector('.search-bar');
    const map = L.map('map').setView([51.505, -0.09], 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    searchButton.addEventListener('click', () => {
        const query = searchBar.value;
        if (query) {
            // Redirect to map.html with the search query as a parameter
            window.location.href = `map.html?query=${encodeURIComponent(query)}`;
        } else {
            alert('Please enter a search term');
        }
    });

    // Option buttons functionality and microphone button code remains unchanged
    const micButton = document.getElementById('micButton');

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
});
