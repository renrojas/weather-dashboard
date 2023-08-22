//GIVEN a weather dashboard with form inputs
//WHEN I search for a city
//THEN I am presented with current and future conditions for that city and that city is added to the search history
//WHEN I view current weather conditions for that city
//THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, and the the wind speed
//WHEN I view future weather conditions for that city
//THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
//WHEN I click on a city in the search history
//THEN I am again presented with current and future conditions for that city




const cityInput = document.getElementById("cityName");
const submit = document.getElementById("submit")
const history = JSON.parse(localStorage.getItem('cities')) || [];
const cities = document.getElementById("cities-box")
var APIKey = "ba06f8ea794c64bd0332bf89734b3bc9";

function getCities() {
  const storedCities = JSON.parse(localStorage.getItem('cities')) || []
  cities.innerHTML = "";
  for (let i = 0; i < storedCities.length; i++) {
    console.log(storedCities[i])
    const getCitiesEl = document.createElement("div");
    const getCitiesHeading = document.createElement("h5");
    getCitiesEl.setAttribute("class","titles")
    getCitiesHeading.textContent = storedCities[i];
    getCitiesEl.appendChild(getCitiesHeading);
    cities.appendChild(getCitiesEl);
  }
}
getCities();

function buttonClick(event) {
  let cityName = event.srcElement.childNodes[0].data;
  getWeather(cityName);
}
cities.addEventListener("click", buttonClick)

function stars(event){
  event.preventDefault();
  getWeather();
}

submit.addEventListener("click", stars);

function getWeather(cityHistory) {
  if (cityHistory) {
    city = cityHistory
  } else {
    var city= cityInput.value;
  }

const cityEl = document.getElementById("city");
const dateEl = document.getElementById("date");
const tempEl = document.getElementById("temperature");
const iconEl = document.getElementById("icon");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");


var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey + "&units=metric";



fetch(queryURL)
.then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
    if (history.indexOf(city) ===-1) {
      history.push(city);
    }

    localStorage.setItem('cities', JSON.stringify(history));
    getCities();

    dateEl.textContent = dayjs.unix(data.dt).format('MM/DD/YYYY');
    tempEl.textContent = data.main.temp + " °C";
    iconEl.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    cityEl.textContent = data.name;
    humidityEl.textContent = "Humidity " + data.main.humidity + "%";
    windEl.textContent = "Wind speed: " + data.wind.speed + " meter/sec";
    forecast(data);
  });
}

//getWeather()
const forecastEl = document.getElementById("forecast-box")

function forecast(dataReceived) {
  const lat = dataReceived.coord.lat
  const lon = dataReceived.coord.lon
    var urlCoord = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=metric&appid=" + APIKey;
 fetch(urlCoord)
 .then(function(response){
  return response.json();
 })  
  .then(function(data) {
    console.log(data, "inside the forecast function")
    for (let i =0; i<data.list.length; i=i+8) {
      const cardEl = document.createElement("div");
      cardEl.setAttribute("class", "test")
      const dateEl = document.createElement("li")
      dateEl.textContent = dayjs.unix(data.list[i].dt).format('MM/DD/YYYY');
      cardEl.appendChild(dateEl);
      const iconEl = document.createElement("img")
      iconEl.src = `https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png`
      cardEl.appendChild(iconEl);
      const tempEl = document.createElement("li")
      tempEl.textContent = data.list[i].main.temp + " °C";
      cardEl.appendChild(tempEl);
      const humidityEl = document.createElement("li");
      humidityEl.textContent = "Humidity: " + data.list[i].main.humidity + "%";
      cardEl.appendChild(humidityEl);
      const windEl = document.createElement("li");
      windEl.textContent = "Wind speed: " + data.list[i].wind.speed + " meter/sec";
      cardEl.appendChild(windEl);
      forecastEl.appendChild(cardEl);
    }

  })   
}

