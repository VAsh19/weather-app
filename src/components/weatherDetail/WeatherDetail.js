import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import "./WeatherDetail.css";

const WeatherDetail = (props) => {
  const { weather , searchClick } = props;
  const [forecastData, setForecastData] = useState([]);


  // console.log(weather.current, weather.forecast);

//   const series = [
//     {
//       name: "Temperature in celcius", //will be displayed on the y-axis
//       data: [43, 53, 50, 57]
//     }
//   ];

  const [series , setSeries] = useState([{
        name: "Temperature in celcius", //will be displayed on the y-axis
        data: [43, 53, 50, 57]
  }]);

  const [options , setOptions] = useState({
    chart: {
      id: "area"
    },
    xaxis: {
      categories: [1, 2, 3, 4] //will be displayed on the x-asis
    }
  })
//   const options = {
//     chart: {
//       id: "area"
//     },
//     xaxis: {
//       categories: [1, 2, 3, 4] //will be displayed on the x-asis
//     }
//   };

  let todayDay = new Date().getDay();
  let todayTime =
    new Date().getHours() > 12
      ? new Date().getHours() - 12 + " PM"
      : new Date().getHours() + " AM";

  let WEEKArray = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thrushday",
    "Friday",
    "Saturday",
  ];

  useEffect(() => {
    let freq = {};
    let forecastArray = [];
    let timeTempArray = {
      time: [],
      temp: [],
    };
    weather.forecast?.list.forEach((element) => {
      let date = element?.dt_txt?.split(" ")[0]?.split("-")[2];
      let time =
        Number(element?.dt_txt?.split(" ")[1]?.split(":")[0]) > 12
          ? Number(element?.dt_txt?.split(" ")[1]?.split(":")[0]) - 12 + " PM"
          : Number(element?.dt_txt?.split(" ")[1]?.split(":")[0]) + " AM";

      if (freq[date]) {
        freq[date] += 1;
        if (timeTempArray.time?.length < 6) {
          timeTempArray.time.push(time);
          timeTempArray.temp.push(Math.round(element?.main?.temp));
        }
      } else {
        freq[date] = 1;
        let obj = {
          icon: element?.weather[0]?.icon,
          high: element?.main?.temp_max,
          low: element.main?.temp_min,
        };

        if (timeTempArray.time?.length < 6) {
          timeTempArray.time.push(time);
          timeTempArray.temp.push(Math.round(element?.main?.temp));
        }
        forecastArray.push(obj);
        // options.xaxis.categories = timeTempArray.time
        // series[0].data = timeTempArray.temp
      }
    });
    setForecastData(forecastArray);
    setSeries(([{
        name: "Temperature in celcius", //will be displayed on the y-axis
        data: timeTempArray?.temp
    }]));
    setOptions({
        ...options,
        xaxis: {
            ...options.xaxis,
            categories: timeTempArray?.time
          }
    })

  }, [searchClick]);



  // console.log(options , series)

  return (
    <div className="weather-summary">
      <div>
        <h2>{`${weather?.current?.name} , ${weather?.current?.sys.country}`}</h2>
        <p>{`${WEEKArray[todayDay]} , ${todayTime}`}</p>
        <p>{weather?.current?.weather[0]?.description}</p>
        <div
          style={{
            display: "flex",
          }}
        >
          <img
            src={`https://openweathermap.org/img/wn/${weather?.current?.weather[0]?.icon}@2x.png`}
            height={"50px"}
          />
          <span style={{ marginTop: "15px" }}>
            {weather?.current?.main.temp}
          </span>
        </div>
      </div>
      <div>
        <Chart
              options={options}
              series={series}
              type="area"
              width="900"
            />
        </div>
      <div className="weekly-weather">
        {forecastData?.map((e, index) => {
          return (
            <div key={index}>
              <p>{WEEKArray[(index + todayDay) % 7]}</p>
              <img
                src={`https://openweathermap.org/img/wn/${e.icon}@2x.png`}
                height={"50px"}
              />
              <p> {`${e.high} | ${e.low}`}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeatherDetail;
