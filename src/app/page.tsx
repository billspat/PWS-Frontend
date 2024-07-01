import { HomeContent } from "./HomeContent";
import { getInitialStations } from "@/util/callApi";

export default async function Home({
  searchParams,
}: {
  searchParams: { start?: string; end?: string };
}) {
  const initialStationData = await getInitialStations();
  const start =
    searchParams.start ||
    new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const end = searchParams.end || new Date().toISOString();

  return (
    <HomeContent
      initialStationData={initialStationData}
      defaultStart={start}
      defaultEnd={end}
    />
  );
}
