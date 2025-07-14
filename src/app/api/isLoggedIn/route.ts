/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function GET(req: NextRequest) {
  try {
    const userData = getDataFromToken(req);
    console.log("Request cookies:", req.cookies.get("token")?.value);

    console.log("🟡 User data from token:", userData);
    if (userData && userData.id) {
      return NextResponse.json(
        {
          isLoggedIn: true,
          id: userData.id,
          name: userData.name,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          isLoggedIn: false,
          message: "Token missing or invalid.",
        },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        isLoggedIn: false,
        message: "Authentication failed.",
      },
      { status: 401 }
    );
  }
}
