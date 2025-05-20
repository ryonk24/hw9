import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

interface Coordinates {
  lat: number;
  lon: number;
}

class Weather {
  city: string;
  country: string;
  currentTemp: number;
  currentWeather: string;
  currentWeatherIcon: string;
  currentWeatherDescription: string;
  forecast: Array<{
    date: string;
    minTemp: number;
    maxTemp: number;
    weather: string;
    weatherIcon: string;
    weatherDescription: string;
  }>;

  constructor() {
    this.city = '';
    this.country = '';
    this.currentTemp = 0;
    this.currentWeather = '';
    this.currentWeatherIcon = '';
    this.currentWeatherDescription = '';
    this.forecast = [];
  }
}

class WeatherService {
  private baseURL: string;
  private apiKey: string;
  private city: string;

  constructor() {
    this.baseURL = 'https://api.openweathermap.org/data/2.5';
    this.apiKey = process.env.OPENWEATHER_API_KEY || '';
    this.city = '';
  }

  private async fetchLocationData(query: string): Promise<any> {
    const url = `${this.baseURL}/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`;
    const response = await axios.get(url);
    return response.data;
  }

  private destructureLocationData(locationData: any): Coordinates {
    return {
      lat: locationData[0].lat,
      lon: locationData[0].lon,
    };
  }

  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=minutely,hourly,alerts&units=metric&appid=${this.apiKey}`;
  }

  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const url = this.buildWeatherQuery(coordinates);
    const response = await axios.get(url);
    return response.data;
  }

  private parseCurrentWeather(response: any): Weather {
    const weather = new Weather();
    weather.city = this.city;
    weather.country = response.timezone;
    weather.currentTemp = response.current.temp;
    weather.currentWeather = response.current.weather[0].main;
    weather.currentWeatherIcon = response.current.weather[0].icon;
    weather.currentWeatherDescription = response.current.weather[0].description;
    return weather;
  }

  private buildForecastArray(weather: Weather, weatherData: any[]): void {
    weather.forecast = weatherData.map((day: any) => ({
      date: new Date(day.dt * 1000).toISOString().split('T')[0],
      minTemp: day.temp.min,
      maxTemp: day.temp.max,
      weather: day.weather[0].main,
      weatherIcon: day.weather[0].icon,
      weatherDescription: day.weather[0].description,
    }));
  }

  async getWeatherForCity(city: string): Promise<Weather> {
    this.city = city;
    const locationData = await this.fetchLocationData(city);
    const coordinates = this.destructureLocationData(locationData);
    const weatherData = await this.fetchWeatherData(coordinates);

    const weather = this.parseCurrentWeather(weatherData);
    this.buildForecastArray(weather, weatherData.daily);

    return weather;
  }
}

export default WeatherService;

