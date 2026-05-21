// OpenWeather API Key
const apiKey = "YOUR_API_KEY";


// Elements
const loading =
document.getElementById("loading");

const forecastDiv =
document.getElementById("forecast");


// ===============================
// DATE & TIME
// ===============================

function updateTime(){

  const now = new Date();

  document.getElementById("dateTime")
  .innerHTML =

  now.toLocaleString("en-US",{

    weekday:"long",

    day:"numeric",

    month:"short",

    hour:"numeric",

    minute:"numeric",

    second:"numeric",

    hour12:true

  });


  // Day / Night
  const hour = now.getHours();

  const skyObject =
  document.getElementById("skyObject");


  // Night
  if(hour >= 18 || hour <= 5){

    skyObject.className =
    "sky-object moon";

  }

  // Day
  else{

    skyObject.className =
    "sky-object sun";

  }

}


// Update Time
setInterval(updateTime,1000);

updateTime();


// ===============================
// WEATHER FUNCTION
// ===============================

async function getWeather(cityName){

  const city =
    cityName ||

    document.getElementById("city")
    .options[
      document.getElementById("city")
      .selectedIndex
    ].value;


  if(city === ""){

    alert("Select city");

    return;
  }


  loading.style.display = "block";


  try{

    const url =

    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;


    const response =
    await fetch(url);

    const data =
    await response.json();


    // Error
    if(data.cod != 200){

      alert("City not found");

      loading.style.display = "none";

      return;
    }


    // Temperature
    const realTemp =
    Math.round(data.main.temp);

    document.getElementById("temp")
    .innerHTML =
    realTemp + "°C";


    // Weather Data
    document.getElementById("cityName")
    .innerHTML = data.name;

    document.getElementById("description")
    .innerHTML =
    data.weather[0].description;

    document.getElementById("humidity")
    .innerHTML =
    data.main.humidity + "%";

    document.getElementById("wind")
    .innerHTML =
    data.wind.speed + " km/h";

    document.getElementById("feels")
    .innerHTML =
    Math.round(data.main.feels_like)
    + "°C";

    document.getElementById("pressure")
    .innerHTML =
    data.main.pressure + " hPa";


    // ===============================
    // WEATHER IMAGE
    // ===============================

    const weatherType =
    data.weather[0].main;


    // Clear
    if(weatherType === "Clear"){

      document.getElementById("icon").src =

      "https://cdn-icons-png.flaticon.com/512/869/869869.png";

    }


    // Clouds
    else if(weatherType === "Clouds"){

      document.getElementById("icon").src =

      "https://cdn-icons-png.flaticon.com/512/414/414825.png";

    }


    // Rain
    else if(weatherType === "Rain"){

      document.getElementById("icon").src =

      "https://cdn-icons-png.flaticon.com/512/1163/1163657.png";

    }


    // Thunderstorm
    else if(weatherType === "Thunderstorm"){

      document.getElementById("icon").src =

      "https://cdn-icons-png.flaticon.com/512/1146/1146860.png";

    }


    // Snow
    else if(weatherType === "Snow"){

      document.getElementById("icon").src =

      "https://cdn-icons-png.flaticon.com/512/642/642102.png";

    }


    // Default
    else{

      document.getElementById("icon").src =

      "https://cdn-icons-png.flaticon.com/512/1779/1779940.png";

    }


    // Background Change
    changeBackground(
      weatherType
    );


    // Forecast
    getForecast(city);


    loading.style.display = "none";

  }

  catch(error){

    alert("Something went wrong");

    loading.style.display = "none";

  }

}


// ===============================
// FORECAST
// ===============================

async function getForecast(city){

  forecastDiv.innerHTML = "";

  const url =

  `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

  const response =
  await fetch(url);

  const data =
  await response.json();


  const forecast =
  data.list.filter(item =>

    item.dt_txt.includes("12:00:00")

  );


  forecast.forEach(day => {

    const date =
    new Date(day.dt_txt);

    forecastDiv.innerHTML += `

      <div class="forecast-item">

        <h4>

        ${date.toLocaleDateString(
          "en-US",
          {weekday:"short"}
        )}

        </h4>

        <img src=
        "https://openweathermap.org/img/wn/${day.weather[0].icon}.png">

        <p>
        ${Math.round(day.main.temp)}°C
        </p>

      </div>

    `;

  });

}


// ===============================
// LOCATION WEATHER
// ===============================

function getLocationWeather(){

  navigator.geolocation
  .getCurrentPosition(position => {

    const lat =
    position.coords.latitude;

    const lon =
    position.coords.longitude;


    fetch(

      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`

    )

    .then(res => res.json())

    .then(data => {

      getWeather(data.name);

    });

  });

}


// ===============================
// VOICE SEARCH
// ===============================

const micBtn =
document.getElementById("micBtn");


const recognition =

new(
  window.SpeechRecognition ||

  window.webkitSpeechRecognition
)();


recognition.onresult =
(event) => {

  const city =
  event.results[0][0].transcript;

  getWeather(city);

};


micBtn.onclick = () => {

  recognition.start();

};


// ===============================
// BACKGROUND CHANGE
// ===============================

function changeBackground(weather){

  // Clear
  if(weather === "Clear"){

    document.body.style.background =

    "url('https://images.pexels.com/photos/531756/pexels-photo-531756.jpeg') no-repeat center center/cover";

  }


  // Clouds
  else if(weather === "Clouds"){

    document.body.style.background =

    "url('https://images.pexels.com/photos/158163/clouds-cloudporn-weather-lookup-158163.jpeg') no-repeat center center/cover";

  }


  // Rain
  else if(weather === "Rain"){

    document.body.style.background =

    "url('https://images.pexels.com/photos/110874/pexels-photo-110874.jpeg') no-repeat center center/cover";

  }


  // Snow
  else if(weather === "Snow"){

    document.body.style.background =

    "url('https://images.pexels.com/photos/688660/pexels-photo-688660.jpeg') no-repeat center center/cover";

  }


  // Thunderstorm
  else if(weather === "Thunderstorm"){

    document.body.style.background =

    "url('https://images.pexels.com/photos/1118869/pexels-photo-1118869.jpeg') no-repeat center center/cover";

  }

}
