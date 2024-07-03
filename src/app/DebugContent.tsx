import React from "react";

interface DebugContentProps {
  selectedStation: string;
  isLoading: boolean;
  error: string | null;
  stationDetails: any;
  weatherReadings: any;
  hourlyWeather: any;
  dailyWeather: any;
}

export function DebugContent({
  selectedStation,
  isLoading,
  error,
  stationDetails,
  weatherReadings,
  hourlyWeather,
  dailyWeather,
}: DebugContentProps) {
  return (
    <>
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
    </>
  );
}
