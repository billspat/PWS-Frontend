import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch(
    "http://ec2-18-207-156-10.compute-1.amazonaws.com/stations/",
    {
      headers: { accept: "application/json" },
    }
  );
  const data = await res.json();
  return NextResponse.json(data);
}
