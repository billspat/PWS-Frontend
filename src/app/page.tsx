import { HomeContent } from "./HomeContent";

interface StationResponse {
  station_codes: string[];
}

// This function will run on the server
async function getInitialStations(): Promise<StationResponse> {
  try {
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const host = process.env.VERCEL_URL || "localhost:3000";
    const response = await fetch(`${protocol}://${host}/api/stations`, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch stations");
    }
    return response.json();
  } catch (error) {
    console.error("Failed to fetch stations:", error);
    return { station_codes: [] };
  }
}

export default async function Home() {
  // Fetch station data on the server
  const initialStationData = await getInitialStations();
  return <HomeContent initialStationData={initialStationData} />;
}
