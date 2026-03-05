// Weather API Configuration
const API_KEY = 'fca17cf505573786efb66857f7037e43';
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// DOM Elements
const permissionScreen = document.getElementById('permissionScreen');
const loadingScreen = document.getElementById('loadingScreen');
const weatherScreen = document.getElementById('weatherScreen');
const errorScreen = document.getElementById('errorScreen');

const allowLocationBtn = document.getElementById('allowLocationBtn');
const refreshBtn = document.getElementById('refreshBtn');
const locateBtn = document.getElementById('locateBtn');
const retryBtn = document.getElementById('retryBtn');

// Search elements
const cityInput = document.getElementById('cityInput');
const searchCityBtn = document.getElementById('searchCityBtn');
const cityInputWeather = document.getElementById('cityInputWeather');
const searchCityBtnWeather = document.getElementById('searchCityBtnWeather');

// Weather Data Elements
const cityName = document.getElementById('cityName');
const dateTime = document.getElementById('dateTime');
const temperature = document.getElementById('temperature');
const weatherIcon = document.getElementById('weatherIcon');
const weatherDesc = document.getElementById('weatherDesc');
const feelsLike = document.getElementById('feelsLike');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const pressure = document.getElementById('pressure');
const visibility = document.getElementById('visibility');
const errorMessage = document.getElementById('errorMessage');

// Store last coordinates for refresh
let lastLat = null;
let lastLon = null;
let lastCity = null;

// Weather Icons Mapping
const weatherIcons = {
    '01d': '☀️', '01n': '🌙',
    '02d': '⛅', '02n': '☁️',
    '03d': '☁️', '03n': '☁️',
    '04d': '☁️', '04n': '☁️',
    '09d': '🌧️', '09n': '🌧️',
    '10d': '🌦️', '10n': '🌧️',
    '11d': '⛈️', '11n': '⛈️',
    '13d': '❄️', '13n': '❄️',
    '50d': '🌫️', '50n': '🌫️'
};

// Event Listeners
allowLocationBtn.addEventListener('click', requestLocation);
refreshBtn.addEventListener('click', handleRefresh);
locateBtn.addEventListener('click', requestLocation);
retryBtn.addEventListener('click', requestLocation);

// City search — permission screen
searchCityBtn.addEventListener('click', () => searchCity(cityInput.value));
cityInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') searchCity(cityInput.value);
});

// City search — weather screen
searchCityBtnWeather.addEventListener('click', () => searchCity(cityInputWeather.value));
cityInputWeather.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') searchCity(cityInputWeather.value);
});

// Initialize
function init() {
    updateDateTime();
    setInterval(updateDateTime, 60000);
}

// Handle refresh — reuse last query
function handleRefresh() {
    if (lastCity) {
        searchCity(lastCity);
    } else if (lastLat !== null && lastLon !== null) {
        showScreen(loadingScreen);
        fetchWeatherByCoords(lastLat, lastLon);
    } else {
        requestLocation();
    }
}

// Request User Location
function requestLocation() {
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by your browser.');
        return;
    }

    showScreen(loadingScreen);

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            lastLat = latitude;
            lastLon = longitude;
            lastCity = null;
            fetchWeatherByCoords(latitude, longitude);
        },
        (error) => {
            handleLocationError(error);
        },
        { timeout: 10000 }
    );
}

// Handle Location Errors
function handleLocationError(error) {
    let message = '';
    switch (error.code) {
        case error.PERMISSION_DENIED:
            message = 'Location access denied. Please enable location permissions or search for a city.';
            break;
        case error.POSITION_UNAVAILABLE:
            message = 'Location unavailable. Please try again or search for a city.';
            break;
        case error.TIMEOUT:
            message = 'Location request timed out. Please try again.';
            break;
        default:
            message = 'An unknown error occurred while getting your location.';
    }
    showError(message);
}

// Search by city name
function searchCity(city) {
    const trimmed = city.trim();
    if (!trimmed) return;

    lastCity = trimmed;
    lastLat = null;
    lastLon = null;
    showScreen(loadingScreen);
    fetchWeatherByCity(trimmed);
}

// Fetch Weather by coordinates
async function fetchWeatherByCoords(lat, lon) {
    try {
        if (apiCounter.isLimitReached()) {
            showError(`API call limit reached (${apiCounter.getCount()}/1000). Resets in ${apiCounter.formatTimeUntilReset()}.`);
            return;
        }

        const url = `${API_BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
        const response = await fetch(url);

        if (!response.ok) throw new Error('Weather data not available');

        const data = await response.json();
        apiCounter.incrementCounter();
        displayWeatherData(data);
    } catch (error) {
        console.error('Error fetching weather:', error);
        showError('Unable to fetch weather data. Please check your connection and try again.');
    }
}

// Fetch Weather by city name
async function fetchWeatherByCity(city) {
    try {
        if (apiCounter.isLimitReached()) {
            showError(`API call limit reached (${apiCounter.getCount()}/1000). Resets in ${apiCounter.formatTimeUntilReset()}.`);
            return;
        }

        const url = `${API_BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
        const response = await fetch(url);

        if (response.status === 404) {
            showError(`City "${city}" not found. Please check the spelling and try again.`);
            return;
        }
        if (!response.ok) throw new Error('Weather data not available');

        const data = await response.json();
        apiCounter.incrementCounter();
        displayWeatherData(data);
    } catch (error) {
        console.error('Error fetching weather:', error);
        showError('Unable to fetch weather data. Please check your connection and try again.');
    }
}

// Display Weather Data
function displayWeatherData(data) {
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    temperature.textContent = Math.round(data.main.temp);
    feelsLike.textContent = `Feels like ${Math.round(data.main.feels_like)}°C`;
    weatherDesc.textContent = data.weather[0].description;

    const iconCode = data.weather[0].icon;
    weatherIcon.textContent = weatherIcons[iconCode] || '🌤️';

    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
    pressure.textContent = `${data.main.pressure} hPa`;
    visibility.textContent = `${(data.visibility / 1000).toFixed(1)} km`;

    updateBackground(data.weather[0].main.toLowerCase());
    showScreen(weatherScreen);

    // Clear search inputs
    cityInputWeather.value = '';
}

// Update Background Based on Weather
function updateBackground(weatherType) {
    const body = document.body;
    body.classList.remove('clear', 'clouds', 'rain', 'drizzle', 'thunderstorm', 'snow', 'mist', 'fog', 'haze');
    body.classList.add(weatherType);
}

// Update Date and Time
function updateDateTime() {
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    if (dateTime) {
        dateTime.textContent = now.toLocaleDateString('en-US', options);
    }
}

// Show Error Screen
function showError(message) {
    errorMessage.textContent = message;
    showScreen(errorScreen);
}

// Show Specific Screen
function showScreen(screenToShow) {
    const screens = [permissionScreen, loadingScreen, weatherScreen, errorScreen];
    screens.forEach(screen => screen.classList.remove('active'));
    screenToShow.classList.add('active');
}

// Initialize app
init();
