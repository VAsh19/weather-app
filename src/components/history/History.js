import React, { useEffect, useState } from "react";
import "./History.css";

const History = (props) => {
  const { handleHistory, setWeatherDetails } = props;
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("weatherHistory");
    const previousHistory = JSON.parse(saved);
    setHistory(previousHistory);
  }, []);

  // console.log(history)

  const handleDelete = (index) => {
    let historyCopy = [...history];
    historyCopy.splice(index, 1);
    setHistory(historyCopy);
    localStorage.setItem("weatherHistory", JSON.stringify(historyCopy));
    if (historyCopy?.length == 0) {
      setWeatherDetails({
        current: {},
        forecast: {},
        day: "",
        time: "",
      });
    }
  };

  const handleEdit = (element, index) => {
    setWeatherDetails(element);
    handleHistory();
  };

  return (
    <div className="weather-history">
      <button className="history_back_button" onClick={handleHistory}>
        {" "}
        BACK
      </button>
      {history?.map((element, index) => {
        return (
          <div key={index}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              <div>{`${element?.current?.name} ${element?.current?.main.temp} ${element?.day} ${element?.time}`}</div>
              <button onClick={() => handleEdit(element, index)}>Edit</button>
              <button onClick={() => handleDelete(index)}>Delete</button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default History;
