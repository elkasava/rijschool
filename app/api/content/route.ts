import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const contentPath = path.join(process.cwd(), "data", "content.json");

export async function GET() {
  try {
    const data = fs.readFileSync(contentPath, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch {
    return NextResponse.json({ error: "Kon content niet laden" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const password = req.headers.get("x-admin-password");
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
  }
  try {
    const body = await req.json();
    fs.writeFileSync(contentPath, JSON.stringify(body, null, 2), "utf-8");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Kon content niet opslaan" }, { status: 500 });
  }
}
