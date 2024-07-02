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
      { error: "Start and end dates are required" },
      { status: 400 }
    );
  }

  const baseUrl = "http://ec2-18-207-156-10.compute-1.amazonaws.com";
  const url = `${baseUrl}/weather/${params.code}/readings?start=${start}&end=${end}`;

  try {
    const response = await fetch(url, {
      headers: {
        accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Error response from external API:", errorData);
      return NextResponse.json(
        { error: `External API error: ${errorData}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch weather readings:", error);
    return NextResponse.json(
      { error: "Failed to fetch weather readings" },
      { status: 500 }
    );
  }
}
