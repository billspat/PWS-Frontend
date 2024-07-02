import { HomeContent } from "./HomeContent";
import {
  getInitialStations,
  getStationData,
  getWeatherData,
  getWeatherReadings,
  getHourlyWeather,
  getDailyWeather,
} from "@/util/callApi";

function formatDateYYYYMMDD(date: Date): string {
  return date.toISOString().split("T")[0];
}

export default async function Home({
  searchParams,
}: {
  searchParams: { station?: string; start?: string; end?: string };
}) {
  const initialStationData = await getInitialStations();

  // ISO format for general use
  const startISO =
    searchParams.start ||
    new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const endISO = searchParams.end || new Date().toISOString();

  // YYYY-MM-DD format for API calls
  const startYMD = formatDateYYYYMMDD(new Date(startISO));
  const endYMD = formatDateYYYYMMDD(new Date(endISO));

  let stationData = null;
  let weatherData = null;
  let weatherReadings = null;
  let hourlyWeather = null;
  let dailyWeather = null;

  if (searchParams.station) {
    [stationData, weatherData, weatherReadings, hourlyWeather, dailyWeather] =
      await Promise.all([
        getStationData(searchParams.station),
        getWeatherData(searchParams.station, startYMD, endYMD),
        getWeatherReadings(searchParams.station, startYMD, endYMD),
        getHourlyWeather(searchParams.station, startYMD, endYMD),
        getDailyWeather(searchParams.station, startYMD, endYMD),
      ]);
  }

  return (
    <HomeContent
      initialStationData={initialStationData}
      initialStationCode={searchParams.station || ""}
      defaultStart={startISO}
      defaultEnd={endISO}
      defaultStartYMD={startYMD}
      defaultEndYMD={endYMD}
      initialStationDetails={stationData}
      initialWeatherData={weatherData}
      initialWeatherReadings={weatherReadings}
      initialHourlyWeather={hourlyWeather}
      initialDailyWeather={dailyWeather}
    />
  );
}
