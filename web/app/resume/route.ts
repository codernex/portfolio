import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.redirect(
    "https://docs.google.com/document/d/1JaB1weC9FownnlkekzC8VCehQKQIHSDiuivFpW4sm2U/export?format=pdf",
    { status: 307 }
  );
}
