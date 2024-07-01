// app/api/weather/[station_code]/readings/route.ts

import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { code: string } }
) {
  const { searchParams } = new URL(request.url);
  const start =
    searchParams.get("start") || new Date().toISOString().split("T")[0];
  const end = searchParams.get("end") || start;

  const baseUrl = "http://ec2-18-207-156-10.compute-1.amazonaws.com";
  const url = `${baseUrl}/weather/${params.code}/readings`;

  const queryParams = new URLSearchParams({ start, end });
  const fullUrl = `${url}?${queryParams.toString()}`;

  console.log("Fetching weather readings from:", fullUrl);

  try {
    const res = await fetch(fullUrl, {
      headers: { accept: "application/json" },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch weather readings:", error);
    return NextResponse.json(
      { error: "Failed to fetch weather readings" },
      { status: 500 }
    );
  }
}
