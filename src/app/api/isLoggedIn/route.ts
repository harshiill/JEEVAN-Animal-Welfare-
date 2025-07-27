import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function GET(req: NextRequest) {
  try {
    const userData = getDataFromToken(req);

    if (!userData) {
      return NextResponse.json(
        {
          isLoggedIn: false,
          message: "Invalid or expired token.",
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        isLoggedIn: true,
        id: userData.id,
        name: userData.name,
      },
      {
        status: 200,
        headers: {
          // Optional: disable caching to ensure always fresh auth check
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("❌ Auth check failed:", error);

    return NextResponse.json(
      {
        isLoggedIn: false,
        message: "Authentication check failed.",
      },
      { status: 500 }
    );
  }
}
