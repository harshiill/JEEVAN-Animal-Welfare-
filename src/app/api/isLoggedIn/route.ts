/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest,NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function GET(req: NextRequest) {
    try {
        const id = await getDataFromToken(req);

    if(id)
    {
        return NextResponse.json({ isLoggedIn: true, id }, { status: 200 });
    }
    else
    {
        return NextResponse.json({ isLoggedIn: false }, { status: 401 });
    }
    } catch (error : any) {
         return NextResponse.json({ authenticated: false }, { status: 200 });
    }
    
}