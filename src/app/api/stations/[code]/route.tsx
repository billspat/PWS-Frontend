import { NextResponse } from "next/server";

console.log("API route file loaded");

export async function GET(
  request: Request,
  { params }: { params: { code: string } }
) {
  const url = `http://ec2-18-207-156-10.compute-1.amazonaws.com/stations/${params.code}`;
  const res = await fetch(url, { headers: { accept: "application/json" } });
  return NextResponse.json(await res.json());
}
