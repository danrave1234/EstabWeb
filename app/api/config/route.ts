import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

const SITE_DATA_PATH = path.join(process.cwd(), "config", "site-data.json");

function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
  const out = { ...target };
  for (const key of Object.keys(source)) {
    const a = out[key];
    const b = source[key];
    if (a != null && b != null && typeof a === "object" && typeof b === "object" && !Array.isArray(a) && !Array.isArray(b)) {
      out[key] = deepMerge(a as Record<string, unknown>, b as Record<string, unknown>);
    } else if (source[key] !== undefined) {
      out[key] = source[key];
    }
  }
  return out;
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const raw = await fs.readFile(SITE_DATA_PATH, "utf-8");
    const data = JSON.parse(raw);
    return NextResponse.json(data);
  } catch (err) {
    console.error("Failed to read site-data.json:", err);
    return NextResponse.json(
      { error: "Failed to load config" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    let existing: Record<string, unknown> = {};
    try {
      const raw = await fs.readFile(SITE_DATA_PATH, "utf-8");
      existing = JSON.parse(raw);
    } catch {
      // file missing or invalid; will write body as-is
    }
    const merged = deepMerge(existing, body);
    await fs.writeFile(
      SITE_DATA_PATH,
      JSON.stringify(merged, null, 2),
      "utf-8"
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to write site-data.json:", err);
    return NextResponse.json(
      { error: "Failed to save config" },
      { status: 500 }
    );
  }
}
