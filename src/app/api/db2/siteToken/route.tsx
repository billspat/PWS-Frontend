import { NextResponse } from "next/server";

export async function GET() {
  if (!process.env.ENVIROWEATHER_API_URL) {
    return NextResponse.json(
      { error: "ENVIROWEATHER_API_URL is not set" },
      { status: 500 }
    );
  }

  const tokenUrl = `${process.env.ENVIROWEATHER_API_URL}/db2/siteToken`;
  console.log("Fetching token from:", tokenUrl);

  try {
    const tokenResponse = await fetch(tokenUrl, {
      headers: { Accept: "application/json" },
      method: "GET",
    });

    console.log("Token response status:", tokenResponse.status);
    console.log(
      "Token response headers:",
      JSON.stringify(Object.fromEntries(tokenResponse.headers))
    );

    const responseText = await tokenResponse.text();
    console.log("Token response body:", responseText);

    if (!tokenResponse.ok) {
      throw new Error(
        `Failed to fetch site token: ${tokenUrl} ${tokenResponse.status} ${tokenResponse.statusText}\nResponse: ${responseText}`
      );
    }

    let tokenData;
    try {
      tokenData = JSON.parse(responseText);
    } catch (parseError) {
      throw new Error(
        `Failed to parse token response: ${parseError.message}\nResponse: ${responseText}`
      );
    }

    if (!tokenData.data || !tokenData.data.token) {
      throw new Error(
        `Token not found in response: ${JSON.stringify(tokenData)}`
      );
    }

    return NextResponse.json({ token: tokenData.data.token });
  } catch (error) {
    console.error("Error fetching site token:", error);
    return NextResponse.json(
      { error: `Failed to fetch EnviroWeather token: ${error.message}` },
      { status: 500 }
    );
  }
}
