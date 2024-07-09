import React, { useState, useEffect, useCallback, useRef } from "react";
import { getHourlyWeather } from "@/util/callApi";

interface HourlyContentProps {
  selectedStation: string;
  isLoading: boolean;
  error: string | null;
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
}: HourlyContentProps) {
  const [hourlyData, setHourlyData] = useState<HourlyData[]>([]);
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [error, setError] = useState(initialError);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef<IntersectionObserver | null>(null);

  const loadMoreData = useCallback(async () => {
    if (!selectedStation || isLoading) return;
    setIsLoading(true);
    console.log("triggered");
    try {
      const prevDate = new Date(currentDate);
      prevDate.setDate(prevDate.getDate() - 1);
      const formattedDate = formatDate(prevDate);
      const newHourlyData = await getHourlyWeather(
        selectedStation,
        formattedDate,
        formattedDate
      );
      if (
        newHourlyData &&
        Array.isArray(newHourlyData) &&
        newHourlyData.length > 0
      ) {
        setHourlyData((prevData) => [...prevData, ...newHourlyData]);
        setCurrentDate(prevDate);
      }
      setHasMore(false);
    } catch (err) {
      setError("Failed to fetch hourly weather data.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedStation, currentDate, isLoading]);

  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMoreData();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, loadMoreData]
  );
  const formatDate = (date: Date) => {
    const d = new Date(
      date.toLocaleString("en-US", { timeZone: "America/New_York" })
    );
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")}`;
  };

  useEffect(() => {
    setHourlyData([]);
    setCurrentDate(new Date());
    setHasMore(true);
    setError(null);
    loadMoreData();
  }, [selectedStation]);

  if (!selectedStation) {
    return <div>Please select a station to view hourly weather data.</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const dataKeys =
    hourlyData.length > 0
      ? Object.keys(hourlyData[0]).filter(
          (key) =>
            key !== "station_code" &&
            key !== "year" &&
            key !== "day" &&
            key !== "represented_date" &&
            key !== "represented_hour"
        )
      : [];

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-bold mb-4">
        Hourly Weather for {selectedStation}
      </h2>
      <div className="flex-grow overflow-scroll h-screen">
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
      </div>
      <div ref={lastElementRef} className="py-2">
        {isLoading && "Loading more..."}
      </div>
      {!isLoading && !hasMore && (
        <div className="py-2">No more data to load.</div>
      )}
    </div>
  );
}
