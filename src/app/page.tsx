// app/page.tsx

import { HomeContent } from "./HomeContent";
import { getInitialStations } from "@/util/callApi";

function formatDateYYYYMMDD(date: Date): string {
  return date.toISOString().split("T")[0];
}
export default async function Home({
  searchParams,
}: {
  searchParams: { station?: string; start?: string; end?: string };
}) {
  const initialStationData = await getInitialStations();

  const startDate = searchParams.start
    ? new Date(searchParams.start)
    : new Date(Date.now() - 24 * 60 * 60 * 1000);
  const endDate = searchParams.end ? new Date(searchParams.end) : new Date();

  const defaultStartYMD = startDate.toISOString().split("T")[0];
  const defaultEndYMD = endDate.toISOString().split("T")[0];
  const defaultStart = startDate.toISOString();
  const defaultEnd = endDate.toISOString();

  return (
    <HomeContent
      initialStationData={initialStationData}
      initialStationCode={searchParams.station || ""}
      defaultStart={defaultStart}
      defaultEnd={defaultEnd}
      defaultStartYMD={defaultStartYMD}
      defaultEndYMD={defaultEndYMD}
    />
  );
}
