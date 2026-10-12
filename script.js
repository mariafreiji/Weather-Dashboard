// select the page elements
const form = document.querySelector("#search-form");
const input = document.querySelector("#city-input");
const searchButton = document.querySelector("#search-button");
const loading = document.querySelector("#loading");
const errorMessage = document.querySelector("#error");
const retryButton = document.querySelector("#retry-button");
const weatherCard = document.querySelector("#weather-card");

const GEO = "https://geocoding-api.open-meteo.com/v1/search";
const WX = "https://api.open-meteo.com/v1/forecast";

// fetch JSON and check the HTTP response
async function getJSON(url) {
    const response = await fetch(url);

    if (!response.ok) {
        if (response.status === 429) {
            throw new Error("Too many requests. Please try again later.");
        }

        throw new Error("The weather service is unavailable. Please try again.");
    }

    const data = await response.json();
    return data;
}

// find the city and then take the current weather of the chosen city
async function loadWeather(city) {
    const cityParams = new URLSearchParams({
        name: city,
        count: 1,
        language: "en"
    });

    const geo = await getJSON(`${GEO}?${cityParams}`);

    if (!geo.results?.length) {
        throw new Error("City not found. Please check the city name.");
    }

    const location = geo.results[0];

    const weatherParams = new URLSearchParams({
        latitude: location.latitude,
        longitude: location.longitude,
        current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day",
        timezone: "auto"
    });

    const weather = await getJSON(`${WX}?${weatherParams}`);

    return {
        location: location,
        current: weather.current
    };
}

// transform the weather code into a description and an icon
function getWeatherInfo(code, isDay) {
    if (code === 0) {
        if (isDay === 0) {
            return { description: "Clear night", icon: "☾" };
        }

        return { description: "Clear sky", icon: "☀" };
    }

    if (code === 1 || code === 2) {
        return { description: "Partly cloudy", icon: "⛅︎" };
    }

    if (code === 3) {
        return { description: "Overcast", icon: "☁" };
    }

    if (code === 45 || code === 48) {
        return { description: "Foggy", icon: "≋" };
    }

    if (code === 51 || code === 53 || code === 55) {
        return { description: "Drizzle", icon: "☂" };
    }

    if (code === 56 || code === 57) {
        return { description: "Freezing drizzle", icon: "☂" };
    }

    if (code === 61 || code === 63 || code === 65) {
        return { description: "Rainy", icon: "☂" };
    }

    if (code === 66 || code === 67) {
        return { description: "Freezing rain", icon: "☂" };
    }

    if (code === 71 || code === 73 || code === 75 || code === 77) {
        return { description: "Snowy", icon: "❄" };
    }

    if (code === 80 || code === 81 || code === 82) {
        return { description: "Rain showers", icon: "☂" };
    }

    if (code === 85 || code === 86) {
        return { description: "Snow showers", icon: "❄" };
    }

    if (code === 95) {
        return { description: "Thunderstorm", icon: "ϟ" };
    }

    if (code === 96 || code === 99) {
        return { description: "Thunderstorm with hail", icon: "ϟ" };
    }

    return { description: "Weather condition unavailable", icon: "☁" };
}

// show the weather data on the page
function renderWeather(data) {
    const current = data.current;
    const info = getWeatherInfo(current.weather_code, current.is_day);

    document.querySelector("#city-name").textContent = data.location.name;
    document.querySelector("#country-name").textContent =
        data.location.country || "";

    document.querySelector("#temperature").textContent =
        `${current.temperature_2m} °C`;

    document.querySelector("#description").textContent = info.description;
    document.querySelector("#weather-icon").textContent = info.icon;

    document.querySelector("#feels-like").textContent =
        `${current.apparent_temperature} °C`;

    document.querySelector("#humidity").textContent =
        `${current.relative_humidity_2m} %`;

    document.querySelector("#wind-speed").textContent =
        `${current.wind_speed_10m} km/h`;

    weatherCard.hidden = false;
}

// for search, loading and error messages
async function onSearch() {
    if (searchButton.disabled) {
        return;
    }

    const city = input.value.trim();

    errorMessage.hidden = true;
    retryButton.hidden = true;
    weatherCard.hidden = true;

    if (city === "") {
        errorMessage.textContent = "Please enter a city name.";
        errorMessage.hidden = false;
        return;
    }

    loading.hidden = false;
    searchButton.disabled = true;

    try {
        const data = await loadWeather(city);
        renderWeather(data);
    } catch (error) {
        if (error instanceof TypeError) {
            errorMessage.textContent =
                "Unable to connect. Check your internet connection and try again.";
        } else {
            errorMessage.textContent = error.message;
        }

        errorMessage.hidden = false;
        retryButton.hidden = false;
    } finally {
        loading.hidden = true;
        searchButton.disabled = false;
    }
}

// Search without reloading the page
form.addEventListener("submit", function (event) {
    event.preventDefault();
    onSearch();
});

// Repeat the search when the user clicks Try again
retryButton.addEventListener("click", function () {
    onSearch();
});