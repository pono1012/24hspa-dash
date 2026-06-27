import React, { useState, useEffect } from 'react';
import { CloudRain, Wind, Thermometer, Droplets, Sun, Cloud, CloudSun, CloudLightning, Snowflake } from 'lucide-react';
import './WeatherWidget.css';

const WeatherWidget = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch('/api/yr/locations/2-7535477/forecast');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        
        // Extract current weather from yr.no API shortIntervals
        const current = data.shortIntervals[0];
        const symbolCode = current.symbolCode?.next1Hour || current.symbolCode?.next6Hours || 'partlycloudy_day';
        
        setWeatherData({
          temp: current.temperature.value,
          humidity: current.humidity.value,
          windSpeed: current.wind.speed * 3.6, // convert m/s to km/h
          symbol: symbolCode
        });
      } catch (err) {
        console.error('Failed to fetch weather:', err);
        setError(err);
      }
    };

    fetchWeather();
    
    // Refresh every 10 minutes
    const interval = setInterval(fetchWeather, 600000);
    return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = (symbol) => {
    if (!symbol) return <CloudSun size={24} className="weather-icon" color="#f5a623" />;
    
    if (symbol.includes('rain') || symbol.includes('showers')) return <CloudRain size={24} className="weather-icon" color="#4a90e2" />;
    if (symbol.includes('cloud') && !symbol.includes('partly')) return <Cloud size={24} className="weather-icon" color="#9b9b9b" />;
    if (symbol.includes('partlycloudy')) return <CloudSun size={24} className="weather-icon" color="#f5a623" />;
    if (symbol.includes('clear') || symbol.includes('fair') || symbol.includes('sun')) return <Sun size={24} className="weather-icon" color="#f5a623" />;
    if (symbol.includes('snow') || symbol.includes('sleet')) return <Snowflake size={24} className="weather-icon" color="#fff" />;
    if (symbol.includes('thunder')) return <CloudLightning size={24} className="weather-icon" color="#bd10e0" />;
    
    return <CloudSun size={24} className="weather-icon" color="#f5a623" />;
  };
  
  const formatCondition = (symbol) => {
    if (!symbol) return 'Unknown';
    let clean = symbol.split('_')[0];
    if (clean.toLowerCase() === 'partlycloudy') return 'Partly Cloudy';
    if (clean.toLowerCase() === 'clearsky') return 'Clear Sky';
    return clean.charAt(0).toUpperCase() + clean.slice(1);
  };

  const getTrackStatus = (symbol) => {
    if (!symbol) return { label: 'DRY', class: 'dry' };
    if (symbol.includes('rain') || symbol.includes('showers') || symbol.includes('thunder') || symbol.includes('snow')) {
      return { label: 'WET', class: 'wet' };
    }
    return { label: 'DRY', class: 'dry' };
  };

  const trackStatus = getTrackStatus(weatherData?.symbol);

  return (
    <div className="glass-panel weather-container animate-fade-in" style={{ animationDelay: '0.3s' }}>
      <div className="weather-header">
        <h3 className="panel-title">Weather Spa</h3>
        <span className={`track-status ${trackStatus.class}`}>{trackStatus.label}</span>
      </div>
      
      {weatherData ? (
        <div className="weather-grid">
          <div className="weather-item">
            {getWeatherIcon(weatherData.symbol)}
            <div className="weather-data">
              <span className="weather-value">{formatCondition(weatherData.symbol)}</span>
              <span className="weather-label">Conditions</span>
            </div>
          </div>
          
          <div className="weather-item">
            <Thermometer size={24} className="weather-icon" color="#f5a623" />
            <div className="weather-data">
              <span className="weather-value">{weatherData.temp.toFixed(1)}°C</span>
              <span className="weather-label">Air Temp</span>
            </div>
          </div>

          <div className="weather-item">
            <Droplets size={24} className="weather-icon" color="#bd10e0" />
            <div className="weather-data">
              <span className="weather-value">{weatherData.humidity.toFixed(0)}%</span>
              <span className="weather-label">Humidity</span>
            </div>
          </div>

          <div className="weather-item">
            <Wind size={24} className="weather-icon" color="#50e3c2" />
            <div className="weather-data">
              <span className="weather-value">{weatherData.windSpeed.toFixed(1)} km/h</span>
              <span className="weather-label">Wind</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="weather-loading" style={{ padding: '1rem', textAlign: 'center', color: '#9b9b9b', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {error ? 'Weather data unavailable' : 'Loading weather...'}
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
