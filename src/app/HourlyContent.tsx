import React, { useState, useEffect, useRef, useCallback } from "react";
import { getHourlyWeather } from "@/util/callApi";

interface HourlyContentProps {
  selectedStation: string;
  isLoading: boolean;
  error: string | null;
  jumpToDate?: Date | string; // Make this prop optional and accept string as well
}

interface HourlyData {
  station_code: string;
  year: number;
  day: number;
  represented_date: string;
  represented_hour: number;
  record_count: number;
  [key: string]: number | string;
}

export function HourlyContent({
  selectedStation,
  isLoading: initialLoading,
  error: initialError,
  jumpToDate,
}: HourlyContentProps) {
  const [hourlyData, setHourlyData] = useState<HourlyData[]>([]);
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [error, setError] = useState(initialError);
  const [currentDate, setCurrentDate] = useState(() => {
    if (jumpToDate instanceof Date) {
      return jumpToDate.toISOString().split("T")[0];
    } else if (typeof jumpToDate === "string") {
      return jumpToDate;
    } else {
      return new Date().toISOString().split("T")[0]; // Default to today if jumpToDate is not provided
    }
  });
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [selectedDate, setSelectedDate] = useState(currentDate);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback(
    (node: HTMLTableRowElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && canLoadMore) {
          console.log("Reached the bottom of the scrollable content");
          loadMoreData();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, canLoadMore]
  );

  const loadMoreData = async () => {
    if (!selectedStation || !canLoadMore) return;
    setIsLoading(true);
    setCanLoadMore(false);
    try {
      const prevDate = new Date(currentDate + "T00:00:00-05:00");
      const formattedPrevDate = prevDate.toISOString().split("T")[0];

      const newData = await getHourlyWeather(
        selectedStation,
        formattedPrevDate,
        formattedPrevDate
      );
      setHourlyData((prevData) => [...prevData, ...newData]);
      setCurrentDate(formattedPrevDate);
    } catch (err) {
      setError("Failed to fetch more hourly weather data.");
      console.error(err);
    } finally {
      setIsLoading(false);
      setCanLoadMore(true);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleJumpToDate = async () => {
    if (!selectedStation) return;
    setIsLoading(true);
    try {
      const data = await getHourlyWeather(
        selectedStation,
        selectedDate,
        selectedDate
      );
      setHourlyData(data);
      setCurrentDate(selectedDate);
    } catch (err) {
      setError("Failed to fetch hourly weather data.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleJumpToDate();
  }, [selectedStation]);

  if (!selectedStation) {
    return <div>Please select a station to view hourly weather data.</div>;
  }
  if (isLoading && hourlyData.length === 0) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  const dataKeys =
    hourlyData.length > 0
      ? Object.keys(hourlyData[0]).filter(
          (key) =>
            ![
              "station_code",
              "year",
              "day",
              "represented_date",
              "represented_hour",
            ].includes(key)
        )
      : [];

  return (
    <div className="flex flex-col h-[calc(100vh-250px)]">
      <div className="flex items-center mb-4">
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="mr-2 p-2 border rounded"
        />
        <button
          onClick={handleJumpToDate}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Jump to Date
        </button>
      </div>
      <div className="flex-grow overflow-scroll">
        <table className="w-full bg-white">
          <thead>
            <tr className="bg-gray-200">
              <th className="sticky top-0 left-0 z-10 bg-gray-200 px-4 py-2">
                Date
              </th>
              <th className="sticky top-0 left-[100px] z-10 bg-gray-200 px-4 py-2">
                Hour
              </th>
              {dataKeys.map((key) => (
                <th
                  key={key}
                  className="sticky top-0 z-10 bg-gray-200 px-4 py-2"
                >
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hourlyData.map((hour, index) => (
              <tr
                key={`${hour.represented_date}-${hour.represented_hour}-${index}`}
                className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                ref={index === hourlyData.length - 1 ? lastElementRef : null}
              >
                <td className="sticky left-0 bg-inherit px-4 py-2">
                  {hour.represented_date}
                </td>
                <td className="sticky left-[100px] bg-inherit px-4 py-2">
                  {hour.represented_hour}
                </td>
                {dataKeys.map((key) => (
                  <td key={`${key}-${index}`} className="px-4 py-2">
                    {hour[key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {isLoading && (
          <div className="text-center py-4">Loading more data...</div>
        )}
      </div>
    </div>
  );
}
