const apiKey = '6b6c32193546446f91250814251006';
const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const cityInput = document.getElementById('cityInput');
const recentSelect = document.getElementById('recentSelect');
const errorMsg = document.getElementById('errorMsg');
const currentWeatherDiv = document.getElementById('currentWeather');
const forecastDiv = document.getElementById('forecast');
const themeToggle = document.getElementById('themeToggle');

searchBtn.addEventListener('click', () => handleCitySearch());
cityInput.addEventListener('keydown', (e) => e.key === 'Enter' && handleCitySearch());
locationBtn.addEventListener('click', () => getLocationWeather());
themeToggle.addEventListener('click', () => toggleTheme());
recentSelect.addEventListener('change', (e) => fetchWeather(e.target.value));

document.addEventListener('DOMContentLoaded', () => {
  populateRecentCities();
  if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-mode');
});

function handleCitySearch() {
  const city = cityInput.value.trim();
  if (!city) return showError('Please enter a city name.');
  fetchWeather(city);
}

function getLocationWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => fetchWeather(`${pos.coords.latitude},${pos.coords.longitude}`),
      () => showError('Unable to retrieve your location.')
    );
  } else {
    showError('Geolocation is not supported by your browser.');
  }
}

async function fetchWeather(query) {
  clearError();
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(query)}&days=5&aqi=no&alerts=no`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    displayCurrentWeather(data.location, data.current);
    displayForecast(data.forecast.forecastday);
    updateRecentCities(data.location.name);
    applyWeatherTheme(data.current.condition.text);
  } catch (err) {
    showError(err.message);
  }
}

function displayCurrentWeather(location, current) {
  currentWeatherDiv.innerHTML = `
    <div class="text-center mb-4">
      <h2 class="text-2xl font-bold text-blue-800">${location.name}, ${location.country}</h2>
    </div>
    <div class="flex flex-col sm:flex-row items-center justify-center gap-6">
      <img src="https:${current.condition.icon}" class="w-24 h-24" />
      <div class="text-center sm:text-left">
        <p class="text-2xl font-bold">${current.temp_c}°C</p>
        <p class="capitalize text-gray-600">${current.condition.text}</p>
        <p>Humidity: ${current.humidity}%</p>
        <p>Wind: ${current.wind_kph} kph</p>
      </div>
    </div>
  `;
}

function displayForecast(forecastArray) {
  forecastDiv.innerHTML = '';
  forecastArray.forEach(day => {
    forecastDiv.innerHTML += `
      <div class="forecast-card rounded-lg p-4 flex flex-col items-center">
        <p class="font-semibold text-lg text-gray-800 mb-2">${day.date}</p>
        <img src="https:${day.day.condition.icon}" class="w-16 h-16 mb-2" />
        <p class="text-sm text-gray-700 mb-1">${day.day.condition.text}</p>
        <p class="text-sm mb-1">🌡️ ${day.day.avgtemp_c}°C</p>
        <p class="text-sm mb-1">💧 ${day.day.avghumidity}%</p>
        <p class="text-sm">💨 ${day.day.maxwind_kph} kph</p>
      </div>
    `;
  });
}

function showError(msg) {
  errorMsg.textContent = msg;
}
function clearError() {
  errorMsg.textContent = '';
}

function updateRecentCities(city) {
  let cities = JSON.parse(localStorage.getItem('recentCities')) || [];
  if (!cities.some(c => c.toLowerCase() === city.toLowerCase())) {
    cities.unshift(city);
    if (cities.length > 5) cities.pop();
    localStorage.setItem('recentCities', JSON.stringify(cities));
    populateRecentCities();
  }
}
function populateRecentCities() {
  let cities = JSON.parse(localStorage.getItem('recentCities')) || [];
  recentSelect.innerHTML = '<option value="" disabled selected>Recent Cities</option>';
  if (cities.length > 0) recentSelect.classList.remove('hidden');
  else recentSelect.classList.add('hidden');
  cities.forEach(city => {
    const opt = document.createElement('option');
    opt.value = city;
    opt.textContent = city;
    recentSelect.appendChild(opt);
  });
}

function applyWeatherTheme(condition) {
  document.body.classList.remove('weather-clear','weather-cloudy','weather-rain','weather-thunder','weather-snow','weather-mist');
  const text = condition.toLowerCase();
  if (text.includes('sun') || text.includes('clear')) document.body.classList.add('weather-clear');
  else if (text.includes('cloud')) document.body.classList.add('weather-cloudy');
  else if (text.includes('rain') || text.includes('drizzle')) document.body.classList.add('weather-rain');
  else if (text.includes('thunder')) document.body.classList.add('weather-thunder');
  else if (text.includes('snow')) document.body.classList.add('weather-snow');
  else if (text.includes('mist') || text.includes('fog') || text.includes('haze') || text.includes('smoke')) document.body.classList.add('weather-mist');
  else document.body.classList.add('weather-clear');
}

function toggleTheme() {
  const dark = document.body.classList.toggle('dark-mode');
  localStorage.setItem('theme', dark ? 'dark' : 'light');
}

