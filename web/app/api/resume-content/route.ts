import { NextResponse } from "next/server";

export const revalidate = 60; // Revalidate cache every 60 seconds

const GOOGLE_DOC_ID = "1JaB1weC9FownnlkekzC8VCehQKQIHSDiuivFpW4sm2U";
const TXT_EXPORT_URL = `https://docs.google.com/document/d/${GOOGLE_DOC_ID}/export?format=txt`;

export async function GET() {
  try {
    const res = await fetch(TXT_EXPORT_URL, {
      next: { revalidate: 60 },
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch Google Doc: ${res.statusText}`);
    }

    const textContent = await res.text();

    return NextResponse.json({
      success: true,
      content: textContent,
      docId: GOOGLE_DOC_ID,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("RESUME_FETCH_ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to retrieve resume content from Google Docs",
      },
      { status: 500 }
    );
  }
}
