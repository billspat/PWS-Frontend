"use client";

import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
  memo,
} from "react";
import { FaChevronDown, FaBars } from "react-icons/fa";
import {
  getStationData,
  getWeatherReadings,
  getHourlyWeather,
  getDailyWeather,
} from "@/util/callApi";
import { useRouter, useSearchParams } from "next/navigation";
import { DebugContent } from "./DebugContent";
import { HourlyContent } from "./HourlyContent";
import { StationData } from "../types";
import { TomCastContent } from "./TomCastContent";
import Map from "./components/Map";

interface StationResponse {
  station_codes: string[];
}

function formatDateYYYYMMDD(date: Date): string {
  const estDate = new Date(
    date.toLocaleString("en-US", { timeZone: "America/New_York" })
  );
  return estDate.toISOString().split("T")[0];
}

const MemoizedMap = memo(Map);

const Header = memo(
  ({
    searchTerm,
    setSearchTerm,
    filteredStations,
    handleStationSelect,
  }: {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    filteredStations: string[];
    handleStationSelect: (code: string) => void;
  }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

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
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
      <header className="bg-[#18453b] text-white p-4 flex items-center">
        <h1 className="text-2xl font-bold mr-5">PWS</h1>
        <div className="relative" ref={searchRef}>
          <div className="flex items-center bg-white rounded">
            <input
              type="text"
              placeholder="Search stations"
              className="px-2 py-1 text-black rounded-l focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
            <div className="absolute top-full left-0 bg-white text-black mt-1 w-full max-h-60 overflow-y-auto rounded shadow z-20">
              {filteredStations.map((code) => (
                <div
                  key={code}
                  className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
                  onClick={() => {
                    handleStationSelect(code);
                    setShowDropdown(false);
                  }}
                >
                  {code}
                </div>
              ))}
            </div>
          )}
        </div>
      </header>
    );
  }
);

const StationContent = memo(
  ({
    selectedStation,
    defaultStart,
    defaultEnd,
    isLoading,
    error,
    stationDetails,
    weatherReadings,
    hourlyWeather,
    dailyWeather,
  }: {
    selectedStation: string;
    defaultStart: string;
    defaultEnd: string;
    isLoading: boolean;
    error: string | null;
    stationDetails: StationData | null;
    weatherReadings: any;
    hourlyWeather: any;
    dailyWeather: any;
  }) => {
    const [activeTab, setActiveTab] = useState("hourly");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const mobileMenuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          mobileMenuRef.current &&
          event.target instanceof Node &&
          !mobileMenuRef.current.contains(event.target)
        ) {
          setMobileMenuOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    const toggleMobileMenu = () => {
      setMobileMenuOpen(!mobileMenuOpen);
    };

    const renderNavItems = (mobile = false) =>
      ["hourly", "readings", "Station Details", "debug", "tomcast"].map(
        (tab) => (
          <li key={tab} className={mobile ? "mb-2" : ""}>
            <button
              className={`px-3 py-1 rounded ${
                activeTab === tab
                  ? "bg-[#18453b] text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => {
                setActiveTab(tab);
                if (mobile) setMobileMenuOpen(false);
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          </li>
        )
      );

    return (
      <>
        <div className="bg-[#2c7d64] text-white p-2 flex items-center">
          <button
            className="mr-2 text-2xl md:hidden"
            onClick={toggleMobileMenu}
          >
            <FaBars />
          </button>
          <h2 className="text-4xl font-semibold">
            {selectedStation || "No station selected"}
          </h2>
        </div>
        <nav className="bg-gray-100 p-2 hidden md:block">
          <ul className="flex space-x-4">{renderNavItems()}</ul>
        </nav>
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50 md:hidden">
            <div ref={mobileMenuRef} className="bg-white h-full w-64 p-4">
              <button
                className="text-2xl mb-4"
                onClick={() => setMobileMenuOpen(false)}
              >
                &times;
              </button>
              <ul>{renderNavItems(true)}</ul>
            </div>
          </div>
        )}
        <main className="p-4 flex-grow">
          {activeTab === "hourly" && (
            <HourlyContent
              selectedStation={selectedStation}
              isLoading={isLoading}
              error={error}
            />
          )}
          {activeTab === "readings" && (
            <div className="h-[calc(100vh-200px)] overflow-auto">
              Weather Readings Content
            </div>
          )}
          {activeTab === "station" && (
            <div className="h-[calc(100vh-200px)] overflow-auto">
              Station Data Content
            </div>
          )}
          {activeTab === "debug" && (
            <div className="h-[calc(100vh-200px)] overflow-auto">
              <DebugContent
                selectedStation={selectedStation}
                isLoading={isLoading}
                error={error}
                stationDetails={stationDetails}
                weatherReadings={weatherReadings}
                hourlyWeather={hourlyWeather}
                dailyWeather={dailyWeather}
              />
            </div>
          )}
          {activeTab === "tomcast" && (
            <TomCastContent
              selectedStation={selectedStation}
              isLoading={isLoading}
              error={error}
            />
          )}
        </main>
      </>
    );
  }
);
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
  const [showMap, setShowMap] = useState(true);
  const [stationDetails, setStationDetails] = useState<StationData | null>(
    null
  );
  const [weatherReadings, setWeatherReadings] = useState(null);
  const [hourlyWeather, setHourlyWeather] = useState(null);
  const [dailyWeather, setDailyWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const stationFromURL = searchParams.get("station");
    const startFromURL = searchParams.get("start") || defaultStart;
    const endFromURL = searchParams.get("end") || defaultEnd;

    if (stationFromURL) {
      setSelectedStation(stationFromURL);
      setSearchTerm(stationFromURL);
      fetchAllData(stationFromURL, startFromURL, endFromURL);
      setShowMap(false);
    } else {
      setSelectedStation("");
      setSearchTerm("");
      setShowMap(true);
    }
  }, [searchParams, defaultStart, defaultEnd]);

  const fetchAllData = async (
    stationCode: string,
    start: string,
    end: string
  ) => {
    setIsLoading(true);
    setError(null);
    setStationDetails(null);
    setWeatherReadings(null);
    setHourlyWeather(null);
    setDailyWeather(null);

    const startYMD = formatDateYYYYMMDD(new Date(start));
    const endYMD = formatDateYYYYMMDD(new Date(end));

    try {
      const [
        newStationDetails,
        newWeatherReadings,
        newHourlyWeather,
        newDailyWeather,
      ] = await Promise.all([
        getStationData(stationCode),
        getWeatherReadings(stationCode, startYMD, endYMD),
        getHourlyWeather(stationCode, startYMD, endYMD),
        getDailyWeather(stationCode, startYMD, endYMD),
      ]);

      setStationDetails(newStationDetails);
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

  const handleStationSelect = useCallback(
    (code: string) => {
      setSelectedStation(code);
      setSearchTerm(code);
      setShowMap(false);
      router.push(`?station=${code}&start=${defaultStart}&end=${defaultEnd}`);
    },
    [router, defaultStart, defaultEnd]
  );

  const filteredStations = useMemo(
    () =>
      selectedStation
        ? stationCodes // Show all stations when a station is selected
        : stationCodes.filter((code) =>
            code.toLowerCase().includes(searchTerm.toLowerCase())
          ),
    [stationCodes, searchTerm, selectedStation]
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filteredStations={filteredStations}
        handleStationSelect={handleStationSelect}
      />
      {showMap ? (
        <MemoizedMap center={[-84.6, 44.3]} />
      ) : (
        <StationContent
          selectedStation={selectedStation}
          defaultStart={defaultStart}
          defaultEnd={defaultEnd}
          isLoading={isLoading}
          error={error}
          stationDetails={stationDetails}
          weatherReadings={weatherReadings}
          hourlyWeather={hourlyWeather}
          dailyWeather={dailyWeather}
        />
      )}
    </div>
  );
}
