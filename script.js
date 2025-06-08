// Fetch city coordinates from the CSV file
async function fetchCityCoordinates() {
    const response = await fetch('city_coordinates.csv');
    const text = await response.text();
    const cities = text.split('\n').slice(1).map(row => {
        const [latitude, longitude, city, country] = row.split(',');
        return { latitude, longitude, city, country };
    });
    return cities;
}

// Populate the city dropdown
async function populateCityDropdown() {
    const cities = await fetchCityCoordinates();
    const cityDropdown = document.getElementById('city');
    cities.forEach(({ city, country }) => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = `${city}, ${country}`;
        cityDropdown.appendChild(option);
    });

    cityDropdown.addEventListener('change', (event) => {
        const selectedCity = cities.find(c => c.city === event.target.value);
        fetchWeatherForecast(selectedCity);
    });
}

// Fetch weather forecast data from 7Timer! API
async function fetchWeatherForecast({ latitude, longitude }) {
    const response = await fetch(`http://www.7timer.info/bin/api.pl?lon=${longitude}&lat=${latitude}&product=civillight&output=json`);
    const data = await response.json();
    displayForecast(data.dataseries);
}

// Display the forecast data
function displayForecast(forecastData) {
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = ''; // Clear previous forecast

    forecastData.forEach(day => {
        const card = document.createElement('div');
        card.classList.add('forecast-card');

        const date = new Date(day.date.toString().slice(0, 4) + '-' + day.date.toString().slice(4, 6) + '-' + day.date.toString().slice(6));
        const formattedDate = date.toDateString().split(' ').slice(0, 3).join(' ');

        card.innerHTML = `
            <h3>${formattedDate}</h3>
            <img src="images/${day.weather}.png" alt="${day.weather}">
            <p>${day.weather.replace('_', ' ')}</p>
            <p>H: ${day.temp2m.max} °C</p>
            <p>L: ${day.temp2m.min} °C</p>
        `;

        forecastContainer.appendChild(card);
    });
}

// Initialize the app
populateCityDropdown();
