const input = document.querySelector("#search");
const searchBtn = document.querySelector("#search-btn");
const searchContent = document.querySelector(".search-content");
const weatherCard = document.querySelector(".weather-card");
const h2Temp = document.querySelector(".temp");
const pCity = document.querySelector(".city");
const h2Forecast = document.querySelector(".forecast");
const pForeDesc = document.querySelector(".forecast-desc");
const feel = document.querySelector("#feel");
const hum = document.querySelector("#hum");
const vis = document.querySelector("#vis");
const min = document.querySelector("#min");
const max = document.querySelector("#max");
const convertBtn = document.querySelector(".convert-btn");
const backBtn = document.querySelector(".back-btn");

let convert = false;

async function getWeather(city) {
  try {
    const response = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=5decbd141451f74af96dd7cedb1af758`
    );
    const json = await response.json();
    return getData(json);
  } catch (err) {
    console.log(err);
  }
}

function getData(data) {
  const obj = {
    temp: +(data.main.temp - 273.15).toFixed(1),
    feelsLike: +(data.main["feels_like"] - 273.15).toFixed(1),
    highs: +(data.main["temp_max"] - 273.15).toFixed(1),
    lows: +(data.main["temp_min"] - 273.15).toFixed(1),
    forecast: data.weather[0].main,
    forecastDesc: data.weather[0].description,
    humidity: data.main.humidity,
    visibility: data.visibility,
    country: data.sys.country,
    icon: data.weather[0].icon,
    name: data.name,
  };
  return obj;
}

function showData(data) {
  h2Forecast.textContent = data.forecast;
  pForeDesc.textContent = data.forecastDesc;
  hum.textContent = data.humidity;
  vis.textContent = data.visibility;
  pCity.textContent = `${data.name}, ${data.country}`;
  if (convert === false) {
    h2Temp.textContent = data.temp + "°";
    feel.textContent = data.feelsLike + "°";
    min.textContent = data.lows + "°";
    max.textContent = data.highs + "°";
  } else if (convert === true) {
    h2Temp.textContent = cToF(data.temp) + "°";
    feel.textContent = cToF(data.feelsLike) + "°";
    min.textContent = cToF(data.lows) + "°";
    max.textContent = cToF(data.highs) + "°";
  }
}

function convertTemp() {
  if (convert) {
    h2Temp.textContent = cToF(h2Temp.textContent.replace("°", "")) + "°";
    feel.textContent = cToF(feel.textContent.replace("°", "")) + "°";
    min.textContent = cToF(min.textContent.replace("°", "")) + "°";
    max.textContent = cToF(max.textContent.replace("°", "")) + "°";
  } else {
    h2Temp.textContent = fToC(h2Temp.textContent.replace("°", "")) + "°";
    feel.textContent = fToC(feel.textContent.replace("°", "")) + "°";
    min.textContent = fToC(min.textContent.replace("°", "")) + "°";
    max.textContent = fToC(max.textContent.replace("°", "")) + "°";
  }
}

function cToF(c) {
  let f = +c * 1.8 + 32;
  return +f.toFixed(1);
}

function fToC(f) {
  let c = (+f - 32) / 1.8;
  return +c.toFixed(1);
}

function show(el) {
  el.style.display = "block";
  setTimeout(function () {
    el.style.opacity = "0.5";
  }, 100);
  setTimeout(function () {
    el.style.transform = "translateY(0px)";
    el.style.opacity = "1";
  }, 200);
}

function hide(el) {
  el.style.display = "none";
  el.style.transform = "translateY(-200px)";
  el.style.opacity = "0";
}

function showOrHideError() {
  const errorCard = document.querySelector(".error");
  const overlay = document.querySelector(".overlay");
  errorCard.classList.remove("hide");
  overlay.classList.remove("hide");
  overlay.addEventListener("click", (e) => {
    errorCard.classList.add("hide");
    overlay.classList.add("hide");
  });
}

async function changeBackground(data) {
  const body = document.querySelector("body");
  if (data) {
    switch (data.forecast) {
      case "Clear":
        body.style.backgroundImage = 'url("images/clear.jpg")';
        break;
      case "Clouds":
        body.style.backgroundImage = 'url("images/cloud.jpg")';
        break;
      case "Rain":
        body.style.backgroundImage = 'url("images/rain.jpg")';
        break;
      case "Snow":
        body.style.backgroundImage = 'url("images/snow.jpg")';
        break;
      default:
        body.style.backgroundImage = 'url("images/sunny.jpg")';
    }
  } else {
    body.style.backgroundImage = 'url("images/sunny.jpg")';
  }
}

searchBtn.addEventListener("click", async function (e) {
  e.preventDefault();
  if (input.validity.valueMissing || /[\d]/gi.test(input.value)) {
    setTimeout(function () {
      input.style.transform = "translateX(15px)";
    }, 0);
    setTimeout(function () {
      input.style.transform = "translateX(-15px)";
    }, 150);
    setTimeout(function () {
      input.style.transform = "translateX(0px)";
    }, 400);
    input.setCustomValidity("I am expecting a city name");
  } else {
    const data = await getWeather(input.value);
    if (data) {
      hide(searchContent);
      show(weatherCard);
      await changeBackground(data);
      showData(data);
      input.value = "";
    } else {
      showOrHideError();
      input.value = "";
    }
  }
});

backBtn.addEventListener("click", () => {
  hide(weatherCard);
  show(searchContent);
  changeBackground(null);
});

convertBtn.addEventListener("click", (e) => {
  convert = !convert;
  if (convert === false) {
    convertBtn.textContent = "C°";
  } else if (convert === true) {
    convertBtn.textContent = "F°";
  }
  convertTemp();
});
