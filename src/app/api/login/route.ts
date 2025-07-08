/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConfig";
import { UserModel } from "@/models/user.models";
import jwt from "jsonwebtoken";

export async function POST(request : NextRequest)
{
    dbConnect();

    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: "Email and password are required." },
                { status: 400 }
            );
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found." },
                { status: 404 }
            );
        }

        if (!user.isVerified) {
            return NextResponse.json(
                { success: false, message: "User is not verified." },
                { status: 403 }
            );
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { success: false, message: "Invalid password." },
                { status: 401 }
            );
        }

        const tokenData = {
        id: user._id,
        username: user.username,
        email: user.email,
    }

        const token=jwt.sign(tokenData,process.env.TOKEN_SECRET!,{
        expiresIn: "1d"})

        const response= NextResponse.json({message: "Login successful",token},{status: 200})

        response.cookies.set("token",token,{httpOnly:true} )

            return response;

        

    } catch (error : any) {
       return NextResponse.json({error: error.message},{status: 500});
        
    }
}

