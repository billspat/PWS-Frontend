import { NextResponse } from "next/server";
import { fetch, Agent } from 'undici';


export async function GET() {
  const baseUrl = process.env.API_BASE_URL;
  const url = `${baseUrl}/stations/`;

  try {
    const response = await fetch(url, {
      // Mocks are also supported
      headers: {
            accept: "application/json",
          },
      dispatcher: new Agent({
        connect: {
          rejectUnauthorized: false,
        },
        keepAliveTimeout: 10,
        keepAliveMaxTimeout: 10
      })
    })
    
    // const json = await res.json()


// -----

    // const response = await fetch(url, 
    //   {
    //   headers: {
    //     accept: "application/json",
    //   },
      
    // });

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
    console.error("Failed to fetch stations:", error);
    return NextResponse.json(
      { error: "Failed to fetch stations" },
      { status: 500 }
    );
  }
}
