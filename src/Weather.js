import React, { useState } from 'react';
import axios from 'axios';
import './Weather.css';
import { useSpring, animated } from 'react-spring';

const Weather = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [isCelsius, setIsCelsius] = useState(true);
  const [savedWeather, setSavedWeather] = useState(JSON.parse(localStorage.getItem('savedWeather')) || null);

  const fetchWeather = async () => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=8f182658370a173d8c0a6d5bb499590f`);
      setWeather(response.data);
    } catch (error) {
      console.error("Error fetching weather data", error);
    }
  };

  const toggleUnit = () => {
    setIsCelsius(!isCelsius);
  };

  const convertToFahrenheit = (celsius) => {
    return (celsius * 9/5) + 32;
  };

  const saveWeather = (weather) => {
    localStorage.setItem('savedWeather', JSON.stringify(weather));
    setSavedWeather(weather);
    alert('Weather saved successfully!');
  };

  const springProps = useSpring({
    from: { opacity: 0, marginTop: -500 },
    to: { opacity: 1, marginTop: 0 },
  });

  return (
    <div className="weather-container">
      <input
        type="text"
        className="input"
        placeholder="Enter City Name"
        value={city}
        onChange={e => setCity(e.target.value)}
      />
      <button className="button" onClick={fetchWeather}>Get Weather</button>
      <button className="button" onClick={toggleUnit}>Switch to {isCelsius ? 'Fahrenheit' : 'Celsius'}</button>
      {weather && (
        <>
          <animated.div style={springProps} className="weather-display">
            <h3>{weather.name}</h3>
            <p>{isCelsius ? weather.main.temp : convertToFahrenheit(weather.main.temp)}° {isCelsius ? 'C' : 'F'}</p>
          </animated.div>
          <button className="button" onClick={() => saveWeather(weather)}>Save Weather</button>
        </>
      )}
      {savedWeather && (
        <div className="saved-weather">
          <h2>Saved Weather</h2>
          <p>{savedWeather.name}: {isCelsius ? savedWeather.main.temp : convertToFahrenheit(savedWeather.main.temp)}° {isCelsius ? 'C' : 'F'}</p>
        </div>
      )}
    </div>
  );
};

export default Weather;
