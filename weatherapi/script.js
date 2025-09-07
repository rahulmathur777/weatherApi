// let APIKey = "d3963c4bf5764b90ac2192640250609";
let APIKey = '68eb9a82e650df54c98feebbf88e20d7';

let getWeatherUrl = (lat, lon, APIKey) =>
  `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${APIKey}`;

let getLatAndLonUrl = (APIKey, city, limit = 1) =>
  `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
    city.trim()
  )}&limit=${limit}&appid=${APIKey}`;

let btn = document.querySelector("button");
let cityName = document.querySelector("input");
let resultDiv = document.getElementById("result");

async function getWeather(city) {
  try {
    // 1. Get latitude & longitude from city
    let { data } = await axios.get(getLatAndLonUrl(APIKey, city));
    if (!data || data.length === 0) throw new Error("City not found");

    const { lat, lon, name, country } = data[0];

    // 2. Get weather using lat/lon
    let weatherData = await axios.get(getWeatherUrl(lat, lon, APIKey));
    weatherData = weatherData.data;

    return { ...weatherData, name, country };
  } catch (err) {
    console.error(err.message);
    return null;
  }
}

btn.addEventListener("click", async () => {
  if (cityName.value.trim() === "") return;

  let data = await getWeather(cityName.value);
  if (!data) {
    resultDiv.innerHTML = `<p style="color:red;">❌ City not found or API issue</p>`;
    return;
  }

  resultDiv.innerHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <p>🌡 Temperature: ${data.main.temp} °C</p>
    <p>🌥 Weather: ${data.weather[0].description}</p>
    <p>🤔 Feels like: ${data.main.feels_like} °C</p>
  `;
});
