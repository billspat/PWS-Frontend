import { NextResponse } from "next/server";

export async function GET() {
  const url = "https://enviroweather.msu.edu/ewx-api/api/db2/siteToken";

  console.log("Fetching EnviroWeather token from:", url);

  try {
    const res = await fetch(url, {
      headers: { accept: "application/json" },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch EnviroWeather token:", error);
    return NextResponse.json(
      { error: "Failed to fetch EnviroWeather token" },
      { status: 500 }
    );
  }
}
