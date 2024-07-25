import React, { useState, useEffect, useRef, useCallback } from "react";
import { getHourlyWeather } from "@/util/callApi";

interface HourlyContentProps {
  selectedStation: string;
  isLoading: boolean;
  error: string | null;
  jumpToDate?: Date | string;
}

interface HourlyData {
  station_code: string;
  year: number;
  day: number;
  represented_date: string;
  represented_hour: number;
  record_count: number;
  formatted_date: string;
  formatted_time: string;
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
      return new Date().toISOString().split("T")[0];
    }
  });
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const observer = useRef<IntersectionObserver | null>(null);

  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const month = monthNames[dateObj.getMonth()];
    const day = dateObj.getDate().toString().padStart(2, "0");
    return `${month} ${day}`;
  };

  const formatTime = (hour: number) => {
    const endHour = hour === 24 ? 12 : hour % 12 || 12;
    const startHour = hour === 1 ? 12 : (hour - 1) % 12 || 12;
    const endAmPm = hour < 12 || hour === 24 ? "AM" : "PM";
    const startAmPm = hour - 1 < 12 && hour !== 24 ? "AM" : "PM";
    return `${endHour}${endAmPm} - ${startHour}${startAmPm}`;
  };

  const formatAndSortData = (data: HourlyData[]) => {
    const sortedData = data.sort(
      (a, b) => b.represented_hour - a.represented_hour
    );
    return sortedData.map((item, index) => ({
      ...item,
      formatted_date: index === 0 ? formatDate(item.represented_date) : "",
      formatted_time: formatTime(item.represented_hour),
    }));
  };

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
      prevDate.setDate(prevDate.getDate() - 1);
      const formattedPrevDate = prevDate.toISOString().split("T")[0];
      const newData = await getHourlyWeather(
        selectedStation,
        formattedPrevDate,
        formattedPrevDate
      );
      const formattedAndSortedNewData = formatAndSortData(newData);
      setHourlyData((prevData) => [...prevData, ...formattedAndSortedNewData]);
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

  const loadDataForDate = async (date: string, retryCount = 0) => {
    if (retryCount > 3) {
      setError("Failed to fetch hourly weather data after multiple attempts.");
      setIsLoading(false);
      return;
    }
    try {
      const data = await getHourlyWeather(selectedStation, date, date);
      if (data.length > 0) {
        const formattedAndSortedData = formatAndSortData(data);
        setHourlyData(formattedAndSortedData);
        setCurrentDate(date);
        setIsLoading(false);
        setError(null);
      } else {
        throw new Error("No data available for the selected date.");
      }
    } catch (err) {
      console.error(`Attempt ${retryCount + 1} failed for date ${date}:`, err);
      const prevDate = new Date(date);
      prevDate.setDate(prevDate.getDate() - 1);
      const formattedPrevDate = prevDate.toISOString().split("T")[0];
      console.log(`Retrying with previous date: ${formattedPrevDate}`);
      await loadDataForDate(formattedPrevDate, retryCount + 1);
    }
  };

  const handleJumpToDate = () => {
    if (!selectedStation) return;
    setIsLoading(true);
    setError(null);
    loadDataForDate(selectedDate);
  };

  useEffect(() => {
    if (selectedStation) {
      setIsLoading(true);
      setError(null);
      loadDataForDate(currentDate);
    }
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
              "formatted_date",
              "formatted_time",
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
      <div className="flex-grow overflow-auto">
        <table className="w-full bg-white border-collapse border-spacing-0">
          <thead>
            <tr className="bg-gray-200">
              <th className="sticky top-0 left-0 z-10 bg-gray-200 p-0">
                <div className="px-4 py-2 w-[150px]">Date</div>
              </th>
              <th className="sticky top-0 left-[150px] z-10 bg-gray-200 p-0">
                <div className="px-4 py-2 w-[150px]">Time</div>
              </th>
              {dataKeys.map((key) => (
                <th key={key} className="sticky top-0 z-8 bg-gray-200 p-0">
                  <div className="px-4 py-2">{key}</div>
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
                <td className="sticky left-0 bg-inherit p-0">
                  <div className="px-4 py-2 w-[150px]">
                    {hour.formatted_date}
                  </div>
                </td>
                <td className="sticky left-[150px] bg-inherit p-0">
                  <div className="px-4 py-2 w-[150px]">
                    {hour.formatted_time}
                  </div>
                </td>
                {dataKeys.map((key) => (
                  <td key={`${key}-${index}`} className="p-0">
                    <div className="px-4 py-2">{hour[key]}</div>
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
