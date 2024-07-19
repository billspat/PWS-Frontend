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
          setLocalError(
            err instanceof Error ? err.message : "Failed to fetch TomCast data"
          );
        } finally {
          setLocalLoading(false);
        }
      };
      fetchTomcastData();
    }
  }, [selectedStation]);

  if (isLoading || localLoading) return <div>Loading...</div>;
  if (error || localError) return <div>Error: {error || localError}</div>;
  if (!tomcastData || !tomcastData.data || !tomcastData.data.Table)
    return <div>No TomCast data available</div>;

  return (
    <div>
      <h2>TomCast Data for {selectedStation}</h2>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={tableHeaderStyle}>Date</th>
            <th style={tableHeaderStyle}>DSV</th>
            <th style={tableHeaderStyle}>SumDSV</th>
            <th style={tableHeaderStyle}>Risk</th>
          </tr>
        </thead>
        <tbody>
          {tomcastData.data.Table.map((row: any, index: number) => (
            <tr
              key={index}
              style={index % 2 === 0 ? evenRowStyle : oddRowStyle}
            >
              <td style={tableCellStyle}>{row.Date}</td>
              <td style={tableCellStyle}>{row.DSV}</td>
              <td style={tableCellStyle}>{row.SumDSV}</td>
              <td style={tableCellStyle}>{row.Risk}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const tableHeaderStyle = {
  backgroundColor: "#f2f2f2",
  padding: "12px",
  textAlign: "left" as const,
  borderBottom: "1px solid #ddd",
};

const tableCellStyle = {
  padding: "12px",
  borderBottom: "1px solid #ddd",
};

const evenRowStyle = {
  backgroundColor: "#f9f9f9",
};

const oddRowStyle = {
  backgroundColor: "#ffffff",
};
