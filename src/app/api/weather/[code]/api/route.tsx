import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { code: string } }
) {
  const { searchParams } = new URL(request.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  if (!start || !end) {
    return NextResponse.json(
      { error: "Start and end parameters are required" },
      { status: 400 }
    );
  }

  const baseUrl = "http://ec2-18-207-156-10.compute-1.amazonaws.com";
  const url = `${baseUrl}/weather/${params.code}/api`;

  const queryParams = new URLSearchParams({ start, end });
  const fullUrl = `${url}?${queryParams.toString()}`;

  console.log("Fetching weather data from:", fullUrl);

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
    console.error("Failed to fetch weather data:", error);
    return NextResponse.json(
      { error: "Failed to fetch weather data" },
      { status: 500 }
    );
  }
}
