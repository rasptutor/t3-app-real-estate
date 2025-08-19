import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, files } = body;

  console.log("Form submitted:", { name, files });

  return NextResponse.json({
    message: "Form saved",
    data: { name, files },
  });
}
