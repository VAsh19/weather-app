import React, { useRef, useState } from "react";
import WeatherDetail from "../weatherDetail/WeatherDetail";
import "./Search.css";
import History from "../history/History";

const Search = () => {
  const inputRef = useRef(null);

  const API_KEY = "b49bbb3b9db901d9864e5d5d9737058c";
  const [weatherDetails, setWeatherDetails] = useState({
    current: {},
    forecast: {},
    day: "",
    time :""
  });
  const [searchClick , setSearchClicked] = useState(Math.random()*50);
  const [historyClicked , setHistoryClicked] = useState(false);
  let WEEKArray = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thrushday",
    "Friday",
    "Saturday",
  ];


  const handleSearch = () => {
    let cityName = inputRef.current.value;

    const fetchCurrentWeather = fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
    );
    const fetchForeCastWeather = fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`
    );

    Promise.all([fetchCurrentWeather, fetchForeCastWeather])
      .then(async (response) => {
        let fetchCurrentWeatherResponse = await response[0].json();
        let fetchForeCastWeatherResponse = await response[1].json();

        // console.log(fetchCurrentWeatherResponse ,fetchForeCastWeatherResponse );
        setWeatherDetails({
          current: fetchCurrentWeatherResponse,
          forecast: fetchForeCastWeatherResponse,
          day : WEEKArray[new Date().getDay()],
          time : new Date().getHours() > 12
          ? new Date().getHours() - 12 + " PM"
          : new Date().getHours() + " AM",
        });
        let history = [
          {
            current: fetchCurrentWeatherResponse,
            forecast: fetchForeCastWeatherResponse,
            day : WEEKArray[new Date().getDay()],
            time : new Date().getHours() > 12
            ? new Date().getHours() - 12 + " PM"
            : new Date().getHours() + " AM",
          },
        ];
        if (localStorage.getItem("weatherHistory") &&  localStorage.getItem("weatherHistory").length > 0) {
          const saved = localStorage.getItem("weatherHistory");
          const previousHistory = JSON.parse(saved);

          previousHistory.push({
            current: fetchCurrentWeatherResponse,
            forecast: fetchForeCastWeatherResponse,
            day : WEEKArray[new Date().getDay()],
            time : new Date().getHours() > 12
            ? new Date().getHours() - 12 + " PM"
            : new Date().getHours() + " AM",
          });

          localStorage.setItem(
            "weatherHistory",
            JSON.stringify(previousHistory)
          );
        } else {
          localStorage.setItem("weatherHistory", JSON.stringify(history));
        }

        setSearchClicked(Math.random()*50)
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleHistory = () => {
    setHistoryClicked((prev)=> !prev);
  };

  console.log(localStorage.getItem("weatherHistory"))

  return (
    <>
   {!historyClicked ?  <div>
      <div className="weather-container">
        <div className="weather-header">Weather</div>
        <div className="weather-search">
          <input
            type="text"
            placeholder="City..."
            ref={inputRef}
            style={{
              width: "40vw",
            }}
          />
          <button className="search-button" onClick={handleSearch}>
            Search
          </button>
          <button className="history-button" onClick={handleHistory}>
            History
          </button>
        </div>
      </div>
      {Object.keys(weatherDetails?.current).length != 0 && (
        <WeatherDetail weather={weatherDetails} searchClick={searchClick}/>
      )}
    </div> : <History handleHistory={handleHistory} setWeatherDetails={setWeatherDetails} />}
    </>
  );
};

export default Search;
