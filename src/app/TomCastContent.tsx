import { useState, useEffect } from "react";
import { getTomcastData } from "@/util/callApi";

export function TomCastContent({
  selectedStation,
  isLoading,
  error,
}: {
  selectedStation: string;
  isLoading: boolean;
  error: string | null;
}) {
  const [tomcastData, setTomcastData] = useState<any>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [localLoading, setLocalLoading] = useState<boolean>(false);

  useEffect(() => {
    if (selectedStation) {
      const fetchTomcastData = async () => {
        setLocalLoading(true);
        setLocalError(null);
        try {
          const today = new Date().toISOString().split("T")[0];
          const data = await getTomcastData(selectedStation, today);
          setTomcastData(data);
        } catch (err) {
          setLocalError(err.message || "Failed to fetch TomCast data");
        } finally {
          setLocalLoading(false);
        }
      };
      fetchTomcastData();
    }
  }, [selectedStation]);

  if (isLoading || localLoading) return <div>Loading...</div>;
  if (error || localError) return <div>Error: {error || localError}</div>;
  if (!tomcastData) return <div>No TomCast data available</div>;

  return (
    <div>
      <h2>TomCast Data for {selectedStation}</h2>
      <pre>{JSON.stringify(tomcastData, null, 2)}</pre>
    </div>
  );
}
