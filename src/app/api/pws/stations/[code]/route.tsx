import { NextResponse } from "next/server";

console.log("API route file loaded");

export async function GET(
  request: Request,
  { params }: { params: { code: string } }
) {
  const baseUrl = process.env.API_BASE_URL;
  const url = `${baseUrl}/stations/${params.code}`;

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
    console.error("Failed to fetch station details:", error);
    return NextResponse.json(
      { error: "Failed to fetch station details" },
      { status: 500 }
    );
  }
}
