import { StationResponse, StationData } from "../types";

const getBaseUrl = () => {
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const host = process.env.VERCEL_URL || "localhost:3000";
  return `${protocol}://${host}`;
};

export async function getInitialStations(): Promise<StationResponse> {
  try {
    const response = await fetch(`${getBaseUrl()}/api/stations`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch stations");
    }
    return response.json();
  } catch (error) {
    console.error("Failed to fetch stations:", error);
    return { station_codes: [] };
  }
}

export async function getStationData(
  stationCode: string
): Promise<StationData | null> {
  try {
    const response = await fetch(
      `${getBaseUrl()}/api/stations/${stationCode}`,
      {
        next: { revalidate: 3600 },
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to fetch data for station ${stationCode}: ${
          errorData.error || response.statusText
        }`
      );
    }
    return response.json();
  } catch (error) {
    console.error(`Failed to fetch data for station ${stationCode}:`, error);
    return null;
  }
}

export async function getWeatherData(
  stationCode: string,
  start: string,
  end: string
): Promise<any> {
  try {
    const url = `${getBaseUrl()}/api/weather/${stationCode}/api?start=${start}&end=${end}`;
    console.log("Fetching weather data from:", url);
    const response = await fetch(url, { next: { revalidate: 60 } });
    if (!response.ok) {
      throw new Error(`Failed to fetch weather data: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error(
      `Failed to fetch weather data for station ${stationCode}:`,
      error
    );
    return null;
  }
}

export async function getWeatherReadings(
  stationCode: string,
  start: string,
  end: string
): Promise<any> {
  try {
    const url = `${getBaseUrl()}/api/weather/${stationCode}/readings?start=${start}&end=${end}`;
    console.log("Fetching weather readings from:", url);
    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
      next: { revalidate: 60 },
    });
    if (!response.ok) {
      throw new Error(
        `Failed to fetch weather readings: ${response.statusText}`
      );
    }
    return response.json();
  } catch (error) {
    console.error(
      `Failed to fetch weather readings for station ${stationCode}:`,
      error
    );
    return null;
  }
}

export async function getHourlyWeather(
  stationCode: string,
  start: string = new Date().toISOString().split("T")[0],
  end: string = start
): Promise<any> {
  try {
    const url = `${getBaseUrl()}/api/weather/${stationCode}/hourly?start=${start}&end=${end}`;
    console.log("Fetching hourly weather data from:", url);
    const response = await fetch(url, {
      headers: {
        accept: "application/json",
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch hourly weather data: ${response.statusText}, ${errorText}`
      );
    }
    return response.json();
  } catch (error) {
    console.error(
      `Failed to fetch hourly weather data for station ${stationCode}:`,
      error
    );
    throw error;
  }
}

export async function getDailyWeather(
  stationCode: string,
  start: string = new Date().toISOString().split("T")[0],
  end: string = new Date(Date.now() + 86400000).toISOString().split("T")[0]
): Promise<any> {
  try {
    const url = `${getBaseUrl()}/api/weather/${stationCode}/daily?start=${start}&end=${end}`;
    console.log("Fetching daily weather data from:", url);
    const response = await fetch(url, { next: { revalidate: 60 } });
    if (!response.ok) {
      throw new Error(
        `Failed to fetch daily weather data: ${response.statusText}`
      );
    }
    return response.json();
  } catch (error) {
    console.error(
      `Failed to fetch daily weather data for station ${stationCode}:`,
      error
    );
    return null;
  }
}

export async function getEnviroWeatherToken(): Promise<string | null> {
  try {
    const url = `${getBaseUrl()}/api/enviroweather/token`;
    console.log("Fetching EnviroWeather token from:", url);
    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    if (!response.ok) {
      throw new Error(
        `Failed to fetch EnviroWeather token: ${response.statusText}`
      );
    }
    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error("Failed to fetch EnviroWeather token:", error);
    return null;
  }
}
