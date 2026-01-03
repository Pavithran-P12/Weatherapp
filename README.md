# Weather Agent App

A modern, responsive weather application that requests user location permission and displays real-time weather data with dynamic UI changes based on weather conditions.

## Features

✅ Location permission request with user-friendly UI
✅ Real-time weather data from OpenWeatherMap API
✅ Dynamic background themes based on weather conditions
✅ Responsive design for all screen sizes
✅ Detailed weather information (temperature, humidity, wind speed, etc.)
✅ Smooth animations and modern UI

## Setup Instructions

### 1. Get API Key

1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to API Keys section
4. Copy your API key

### 2. Configure the App

1. Open `script.js`
2. Replace `YOUR_API_KEY_HERE` with your actual API key:
   ```javascript
   const API_KEY = 'your_actual_api_key_here';
   ```

### 3. Run the App

#### Option 1: Local Server (Recommended)
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

Then open your browser to `http://localhost:8000`

#### Option 2: Direct File
Simply open `index.html` in your browser. Note: Some browsers may restrict geolocation on file:// protocol.

## How It Works

### 1. Permission Request
- App first shows a permission screen asking for location access
- User-friendly explanation of why location is needed
- Privacy note assuring users their data isn't stored

### 2. Location Detection
- Uses browser's Geolocation API to get user coordinates
- Handles various error cases (permission denied, unavailable, timeout)
- Shows loading screen while fetching location

### 3. Weather Data
- Fetches weather from OpenWeatherMap API using coordinates
- Displays comprehensive weather information:
  - Current temperature and "feels like" temperature
  - Weather description with appropriate emoji
  - Humidity, wind speed, pressure, visibility
  - City name and country
  - Current date and time

### 4. Dynamic UI
- Background gradient changes based on weather:
  - Clear: Purple gradient
  - Clouds: Gray gradient
  - Rain/Drizzle: Blue gradient
  - Thunderstorm: Dark gradient
  - Snow: Light blue gradient
  - Mist/Fog: Gray-dark gradient
- Smooth animations and transitions
- Floating weather icons
- Hover effects on interactive elements

## File Structure

```
Weather Api/
├── index.html      # Main HTML structure
├── style.css       # Styling and weather themes
├── script.js       # JavaScript logic and API calls
└── README.md       # Documentation
```

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Full support

## Privacy

- Location is only used to fetch weather data
- No data is stored or transmitted to third parties
- Only communicates with OpenWeatherMap API

## Troubleshooting

**Location permission denied:**
- Check browser settings to allow location access
- Make sure you're using HTTPS or localhost

**API errors:**
- Verify your API key is correct
- Check if you've exceeded the free tier limits (60 calls/minute)
- Ensure you have an active internet connection

**Weather not loading:**
- Open browser console (F12) to check for errors
- Verify API key is correctly inserted in script.js
- Check if OpenWeatherMap API is accessible

## Customization

### Change Temperature Units
In `script.js`, modify the API URL:
```javascript
// For Fahrenheit
const url = `${API_BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`;
```

### Add More Weather Details
The OpenWeatherMap API provides additional data like sunrise/sunset, UV index, etc. You can extend the app to display these.

### Customize Colors
Modify the gradient colors in `style.css` under the weather-specific body classes:
```css
body.clear {
    background: linear-gradient(135deg, #your-color-1 0%, #your-color-2 100%);
}
```

## Technologies Used

- HTML5
- CSS3 (Flexbox, Grid, Animations)
- JavaScript (ES6+)
- Geolocation API
- OpenWeatherMap API
- Fetch API

## License

Free to use for personal and commercial projects.

---

Enjoy your weather app! 🌤️
