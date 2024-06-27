"use client";

import { useEffect, useState, useRef } from "react";
import { FaChevronDown } from "react-icons/fa";

interface StationResponse {
  station_codes: string[];
}

export function HomeContent({
  initialStationData,
}: {
  initialStationData: StationResponse;
}) {
  const [stationCodes, setStationCodes] = useState<string[]>(
    initialStationData.station_codes
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStation, setSelectedStation] = useState("");
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      <main className="flex-grow p-4 flex items-center justify-center">
        {selectedStation === "" ? (
          <p className="text-xl text-gray-600">Select a station to continue!</p>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">
              Station: {selectedStation}
            </h2>
            <p className="text-lg text-gray-600">
              Placeholder content for {selectedStation}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
