// Weather API Configuration
const API_KEY = 'fca17cf505573786efb66857f7037e43'; // Replace with your OpenWeatherMap API key
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// DOM Elements
const permissionScreen = document.getElementById('permissionScreen');
const loadingScreen = document.getElementById('loadingScreen');
const weatherScreen = document.getElementById('weatherScreen');
const errorScreen = document.getElementById('errorScreen');

const allowLocationBtn = document.getElementById('allowLocationBtn');
const refreshBtn = document.getElementById('refreshBtn');
const retryBtn = document.getElementById('retryBtn');

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

// Weather Icons Mapping
const weatherIcons = {
    '01d': '☀️',
    '01n': '🌙',
    '02d': '⛅',
    '02n': '☁️',
    '03d': '☁️',
    '03n': '☁️',
    '04d': '☁️',
    '04n': '☁️',
    '09d': '🌧️',
    '09n': '🌧️',
    '10d': '🌦️',
    '10n': '🌧️',
    '11d': '⛈️',
    '11n': '⛈️',
    '13d': '❄️',
    '13n': '❄️',
    '50d': '🌫️',
    '50n': '🌫️'
};

// Event Listeners
allowLocationBtn.addEventListener('click', requestLocation);
refreshBtn.addEventListener('click', requestLocation);
retryBtn.addEventListener('click', requestLocation);

// Initialize
function init() {
    updateDateTime();
    setInterval(updateDateTime, 60000); // Update every minute
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
            fetchWeatherData(latitude, longitude);
        },
        (error) => {
            handleLocationError(error);
        }
    );
}

// Handle Location Errors
function handleLocationError(error) {
    let message = '';
    
    switch (error.code) {
        case error.PERMISSION_DENIED:
            message = 'Location access denied. Please enable location permissions in your browser settings.';
            break;
        case error.POSITION_UNAVAILABLE:
            message = 'Location information is unavailable. Please try again.';
            break;
        case error.TIMEOUT:
            message = 'Location request timed out. Please try again.';
            break;
        default:
            message = 'An unknown error occurred while getting your location.';
    }
    
    showError(message);
}

// Fetch Weather Data
async function fetchWeatherData(lat, lon) {
    try {
        // Check if API limit is reached
        if (apiCounter.isLimitReached()) {
            showError(`API call limit reached (${apiCounter.getCount()}/1000). Please wait ${apiCounter.formatTimeUntilReset()} for reset.`);
            return;
        }

        const url = `${API_BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Weather data not available');
        }
        
        const data = await response.json();
        
        // Increment counter after successful API call
        apiCounter.incrementCounter();
        
        displayWeatherData(data);
    } catch (error) {
        console.error('Error fetching weather:', error);
        showError('Unable to fetch weather data. Please check your API key and try again.');
    }
}

// Display Weather Data
function displayWeatherData(data) {
    // Update location
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    
    // Update temperature
    temperature.textContent = Math.round(data.main.temp);
    feelsLike.textContent = `Feels like ${Math.round(data.main.feels_like)}°C`;
    
    // Update weather description
    weatherDesc.textContent = data.weather[0].description;
    
    // Update weather icon
    const iconCode = data.weather[0].icon;
    weatherIcon.textContent = weatherIcons[iconCode] || '🌤️';
    
    // Update weather details
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
    pressure.textContent = `${data.main.pressure} hPa`;
    visibility.textContent = `${(data.visibility / 1000).toFixed(1)} km`;
    
    // Update background based on weather
    updateBackground(data.weather[0].main.toLowerCase());
    
    // Show weather screen
    showScreen(weatherScreen);
}

// Update Background Based on Weather
function updateBackground(weatherType) {
    const body = document.body;
    
    // Remove all weather classes
    body.classList.remove('clear', 'clouds', 'rain', 'drizzle', 'thunderstorm', 'snow', 'mist', 'fog', 'haze', 'default');
    
    // Add appropriate class
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
    dateTime.textContent = now.toLocaleDateString('en-US', options);
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
