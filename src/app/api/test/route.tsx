import { NextResponse } from "next/server";
import { getEnviroWeatherToken } from "@/util/callApi";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const stationCode = searchParams.get("stationCode");
  const stationType = searchParams.get("stationType") || "6";
  const selectDate =
    searchParams.get("selectDate") || new Date().toISOString().split("T")[0];
  const resultModelCode = searchParams.get("resultModelCode") || "tomcast";
  const dateStartAccumulation = searchParams.get("dateStartAccumulation");

  if (!stationCode) {
    return NextResponse.json(
      { error: "stationCode is required" },
      { status: 400 }
    );
  }

  try {
    const token = await getEnviroWeatherToken();
    const apiUrl = `${process.env.TEST_API_URL}/tma/ewx/rm-api/api/db2/run`;
    const fullUrl = `${apiUrl}?stationCode=${stationCode}&stationType=${stationType}&selectDate=${selectDate}&resultModelCode=${resultModelCode}${
      dateStartAccumulation
        ? `&dateStartAccumulation=${dateStartAccumulation}`
        : ""
    }`;

    console.log("Fetching data from:", fullUrl);

    const response = await fetch(fullUrl, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `API request failed: ${response.status} ${response.statusText}\nResponse: ${errorText}`
      );
      return NextResponse.json(
        {
          error: `API request failed: ${response.status} ${response.statusText} ${fullUrl}`,
          details: errorText,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    const apiUrl = `${process.env.TEST_API_URL}/tma/ewx/rm-api/api/db2/run`;
    const fullUrl = `${apiUrl}?stationCode=${stationCode}&stationType=${stationType}&selectDate=${selectDate}&resultModelCode=${resultModelCode}${
      dateStartAccumulation
        ? `&dateStartAccumulation=${dateStartAccumulation}`
        : ""
    }`;
    return NextResponse.json(
      {
        error: "Failed to fetch data",
        details: error instanceof Error ? error.message : String(error),
        url: fullUrl,
      },
      { status: 500 }
    );
  }
}
