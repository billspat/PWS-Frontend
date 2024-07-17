import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = process.env.ENVIROWEATHER_API_URL;
  const url = `${baseUrl}/siteToken`;

  console.log("Fetching EnviroWeather token from:", url);

  try {
    const response = await fetch(url, {
      headers: {
        accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Error response from EnviroWeather API:", errorData);
      return NextResponse.json(
        { error: `EnviroWeather API error: ${errorData}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch EnviroWeather token:", error);
    return NextResponse.json(
      { error: "Failed to fetch EnviroWeather token" },
      { status: 500 }
    );
  }
}
