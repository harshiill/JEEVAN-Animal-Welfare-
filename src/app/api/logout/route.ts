import dbConnect from "@/lib/dbConfig";
import { NextRequest, NextResponse } from "next/server";
/* eslint-disable @typescript-eslint/no-unused-vars */
 /* eslint-disable @typescript-eslint/no-explicit-any */

export async function GET(request : NextRequest)
{
    await dbConnect();
    try {
        const response= NextResponse.json({message: "Logout successful"},{status: 200});

       response.cookies.set("token","",{httpOnly:true,expires: new Date(0)})

        return response;
    } catch (error : any) {
        return NextResponse.json(
            { success: false, message: "Error logging out" },
            { status: 500 }
        );
    }
}