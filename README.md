# SunnyRainy — Weather Dashboard

SunnyRainy is a weather dashboard built with HTML, CSS and JavaScript.
The user can search for a city and view its current weather.

## Features

- Current temperature, weather description and icon
- Feels-like temperature, humidity and wind speed
- Loading message while searching for the data
- Error messages and a retry button
- Responsive white and blue layout

## How to run

1. Download and unzip the project, or clone the repository.
2. Open index.html in a modern web browser.
3. Enter a city name and click Search.

An internet connection is required to fetch weather data.
No installation or build command is needed.

## API

This project uses the Open-Meteo API.
The geocoding API finds the city's coordinates.
The forecast API returns the current weather for those coordinates.

No API key, account or .env file is required for this project.

## JavaScript methods

The project uses async/await, fetch, URLSearchParams and
try/catch/finally to request data and handle errors.
The page is updated dynamically using textContent.
