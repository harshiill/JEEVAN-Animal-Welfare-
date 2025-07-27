import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

interface DecodedToken {
  id: string;
  name: string;
}

export const getDataFromToken = (req: NextRequest): DecodedToken | null => {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) return null;

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as DecodedToken;

    return {
      id: decoded.id,
      name: decoded.name,
    };
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
};
