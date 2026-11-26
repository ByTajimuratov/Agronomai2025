import { Request, Response } from 'express';

// Ob-havo kodlarini tushunarli qilish uchun yordamchi
const getWeatherDetails = (code: number) => {
    switch(code) {
        case 0: return { desc: "Ochiq havo", icon: "01d" };
        case 1: 
        case 2: return { desc: "Biroz bulutli", icon: "02d" };
        case 3: return { desc: "Bulutli", icon: "04d" };
        case 45: 
        case 48: return { desc: "Tuman", icon: "50d" };
        case 51: case 53: case 55: return { desc: "Yengil yomg'ir", icon: "09d" };
        case 61: case 63: return { desc: "Yomg'ir", icon: "10d" };
        case 71: case 73: return { desc: "Qor", icon: "13d" };
        case 95: return { desc: "Momaqaldiroq", icon: "11d" };
        default: return { desc: "O'zgaruvchan", icon: "03d" };
    }
};

// 1. HOZIRGI OB-HAVO (HomeDashboard uchun)
export const getWeather = async (req: Request, res: Response) => {
  try {
    // Urganch koordinatalari
    const lat = 41.55; 
    const lon = 60.63;

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.current) throw new Error("Ma'lumot yo'q");

    const details = getWeatherDetails(data.current.weather_code);

    const weatherData = {
        city: "Urganch",
        temp: Math.round(data.current.temperature_2m),
        description: details.desc,
        humidity: data.current.relative_humidity_2m,
        windSpeed: data.current.wind_speed_10m,
        icon: details.icon 
    };

    res.json(weatherData);

  } catch (error) {
    console.error("Weather Error:", error);
    res.status(500).json({ error: "Xatolik" });
  }
};

// 2. 5 KUNLIK PROGNOZ (Premium Modal uchun)
export const getForecast = async (req: Request, res: Response) => {
  try {
    const lat = 41.55; 
    const lon = 60.63;

    // Kunlik prognozni olamiz
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.daily) throw new Error("Ma'lumot yo'q");

    // Kelasi 5 kunni olamiz
    const forecast = data.daily.time.slice(0, 5).map((date: string, index: number) => {
        const code = data.daily.weather_code[index];
        const details = getWeatherDetails(code);
        
        return {
            date,
            maxTemp: Math.round(data.daily.temperature_2m_max[index]),
            minTemp: Math.round(data.daily.temperature_2m_min[index]),
            description: details.desc,
            icon: details.icon
        };
    });

    res.json(forecast);

  } catch (error) {
    console.error("Forecast Error:", error);
    res.status(500).json({ error: "Prognoz xatosi" });
  }
};