import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { code: string } }
) {
  const { searchParams } = new URL(request.url);
  const start =
    searchParams.get("start") || new Date().toISOString().split("T")[0];
  const end = searchParams.get("end") || start;

  const baseUrl = process.env.API_BASE_URL;
  const url = `${baseUrl}/weather/${params.code}/hourly`;
  const queryParams = new URLSearchParams({ start, end });
  const fullUrl = `${url}?${queryParams.toString()}`;

  console.log("Fetching hourly weather data from:", fullUrl);

  try {
    const res = await fetch(fullUrl, {
      headers: {
        accept: "application/json",
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Error response:", errorText);
      throw new Error(
        `HTTP error! status: ${res.status}, message: ${errorText}`
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: "Failed to fetch hourly weather data",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
