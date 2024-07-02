"use client";
import { useEffect, useState, useRef } from "react";
import { FaChevronDown } from "react-icons/fa";
import {
  getStationData,
  getWeatherData,
  getWeatherReadings,
  getHourlyWeather,
  getDailyWeather,
} from "@/util/callApi";
import { useRouter } from "next/navigation";

interface StationResponse {
  station_codes: string[];
}

export function HomeContent({
  initialStationData,
  initialStationCode,
  defaultStart,
  defaultEnd,
  defaultStartYMD,
  defaultEndYMD,
}: {
  initialStationData: StationResponse;
  initialStationCode: string;
  defaultStart: string;
  defaultEnd: string;
  defaultStartYMD: string;
  defaultEndYMD: string;
}) {
  const [stationCodes] = useState<string[]>(initialStationData.station_codes);
  const [searchTerm, setSearchTerm] = useState(initialStationCode);
  const [selectedStation, setSelectedStation] = useState(initialStationCode);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const [stationDetails, setStationDetails] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [weatherReadings, setWeatherReadings] = useState(null);
  const [hourlyWeather, setHourlyWeather] = useState(null);
  const [dailyWeather, setDailyWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (selectedStation) {
      fetchAllData(selectedStation);
      router.push(
        `?station=${selectedStation}&start=${defaultStart}&end=${defaultEnd}`
      );
    }
  }, [selectedStation, defaultStart, defaultEnd, router]);

  const fetchAllData = async (stationCode: string) => {
    setIsLoading(true);
    setError(null);
    setStationDetails(null);
    setWeatherData(null);
    setWeatherReadings(null);
    setHourlyWeather(null);
    setDailyWeather(null);

    try {
      const [
        newStationDetails,
        newWeatherData,
        newWeatherReadings,
        newHourlyWeather,
        newDailyWeather,
      ] = await Promise.all([
        getStationData(stationCode),
        getWeatherData(stationCode, defaultStartYMD, defaultEndYMD),
        getWeatherReadings(stationCode, defaultStartYMD, defaultEndYMD),
        getHourlyWeather(stationCode, defaultStartYMD, defaultEndYMD),
        getDailyWeather(stationCode, defaultStartYMD, defaultEndYMD),
      ]);

      setStationDetails(newStationDetails);
      setWeatherData(newWeatherData);
      setWeatherReadings(newWeatherReadings);
      setHourlyWeather(newHourlyWeather);
      setDailyWeather(newDailyWeather);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch weather data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStationSelect = (code: string) => {
    setSelectedStation(code);
    setSearchTerm(code);
    setShowDropdown(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedStation) {
      setSearchTerm("");
      setSelectedStation("");
    } else {
      setSearchTerm(e.target.value);
    }
  };

  const filteredStations = selectedStation
    ? stationCodes
    : stationCodes.filter((code) =>
        code.toLowerCase().includes(searchTerm.toLowerCase())
      );

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-[#18453b] text-white p-4 flex items-center">
        <h1 className="text-2xl font-bold mr-5">PWS</h1>
        <div className="relative" ref={searchRef}>
          <div className="flex items-center bg-white rounded">
            <input
              type="text"
              placeholder="Search stations"
              className="px-2 py-1 text-black rounded-l focus:outline-none"
              value={searchTerm}
              onChange={handleInputChange}
              onFocus={() => setShowDropdown(true)}
            />
            <button
              className="text-gray-600 px-2 py-1"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <FaChevronDown />
            </button>
          </div>
          {showDropdown && (
            <div className="absolute top-full left-0 bg-white text-black mt-1 w-full max-h-60 overflow-y-auto rounded shadow">
              {filteredStations.map((code) => (
                <div
                  key={code}
                  className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleStationSelect(code)}
                >
                  {code}
                </div>
              ))}
            </div>
          )}
        </div>
      </header>
      <main className="flex-grow p-4 overflow-auto">
        {selectedStation === "" ? (
          <p className="text-xl text-gray-600 text-center">
            Select a station to continue!
          </p>
        ) : isLoading ? (
          <p className="text-xl text-gray-600 text-center">
            Loading weather data...
          </p>
        ) : error ? (
          <p className="text-xl text-red-600 text-center">{error}</p>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">
              Station: {selectedStation}
            </h2>
            {stationDetails && (
              <div className="mb-4">
                <h3 className="text-xl font-semibold">Station Data</h3>
                <pre className="text-left overflow-x-auto">
                  {JSON.stringify(stationDetails, null, 2)}
                </pre>
              </div>
            )}
            {weatherData && (
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-2">Weather Data</h3>
                <div className="flex flex-nowrap space-x-4 overflow-x-auto pb-4">
                  {Array.isArray(weatherData) ? (
                    weatherData.map((entry, index) => (
                      <div
                        key={index}
                        className="flex-shrink-0 w-64 bg-gray-100 p-4 rounded shadow"
                      >
                        <h4 className="font-semibold mb-2">
                          Entry {index + 1}
                        </h4>
                        <div className="overflow-x-auto">
                          <pre className="text-xs whitespace-pre">
                            {JSON.stringify(entry, null, 2)}
                          </pre>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex-shrink-0 w-full bg-gray-100 p-4 rounded shadow">
                      <div className="overflow-x-auto">
                        <pre className="text-xs whitespace-pre">
                          {JSON.stringify(weatherData, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {weatherReadings && (
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-2">Weather Readings</h3>
                <div className="flex flex-nowrap space-x-4 overflow-x-auto pb-4">
                  {Array.isArray(weatherReadings) ? (
                    weatherReadings.map((entry, index) => (
                      <div
                        key={index}
                        className="flex-shrink-0 w-64 bg-gray-100 p-4 rounded shadow"
                      >
                        <h4 className="font-semibold mb-2">
                          Reading {index + 1}
                        </h4>
                        <div className="overflow-x-auto">
                          <pre className="text-xs whitespace-pre">
                            {JSON.stringify(entry, null, 2)}
                          </pre>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex-shrink-0 w-full bg-gray-100 p-4 rounded shadow">
                      <div className="overflow-x-auto">
                        <pre className="text-xs whitespace-pre">
                          {JSON.stringify(weatherReadings, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {hourlyWeather && (
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-2">Hourly Weather</h3>
                <div className="flex flex-nowrap space-x-4 overflow-x-auto pb-4">
                  {Array.isArray(hourlyWeather) ? (
                    hourlyWeather.map((entry, index) => (
                      <div
                        key={index}
                        className="flex-shrink-0 w-64 bg-gray-100 p-4 rounded shadow"
                      >
                        <h4 className="font-semibold mb-2">Hour {index + 1}</h4>
                        <div className="overflow-x-auto">
                          <pre className="text-xs whitespace-pre">
                            {JSON.stringify(entry, null, 2)}
                          </pre>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex-shrink-0 w-full bg-gray-100 p-4 rounded shadow">
                      <div className="overflow-x-auto">
                        <pre className="text-xs whitespace-pre">
                          {JSON.stringify(hourlyWeather, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {dailyWeather && (
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-2">Daily Weather</h3>
                <div className="flex flex-nowrap space-x-4 overflow-x-auto pb-4">
                  {Array.isArray(dailyWeather) ? (
                    dailyWeather.map((entry, index) => (
                      <div
                        key={index}
                        className="flex-shrink-0 w-64 bg-gray-100 p-4 rounded shadow"
                      >
                        <h4 className="font-semibold mb-2">Day {index + 1}</h4>
                        <div className="overflow-x-auto">
                          <pre className="text-xs whitespace-pre">
                            {JSON.stringify(entry, null, 2)}
                          </pre>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex-shrink-0 w-full bg-gray-100 p-4 rounded shadow">
                      <div className="overflow-x-auto">
                        <pre className="text-xs whitespace-pre">
                          {JSON.stringify(dailyWeather, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
