import { NextRequest} from "next/server";
import jwt from "jsonwebtoken";
/* eslint-disable @typescript-eslint/no-explicit-any */

export const getDataFromToken = async (request : NextRequest) => {
    try {
        const token=request.cookies.get("token")?.value || "";
       const decodedToken : any= jwt.verify(token, process.env.TOKEN_SECRET!);

       return decodedToken.id
    } catch (error : any) {
        throw new Error(error.message);
    
   }
}