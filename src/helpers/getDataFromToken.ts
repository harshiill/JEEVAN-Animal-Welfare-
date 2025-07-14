/* eslint-disable @typescript-eslint/no-unused-vars */
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export const getDataFromToken = (req: NextRequest): { id: string; name: string } | null => {
  try {
    const token = req.cookies.get("token")?.value || "";

    if (!token) return null;

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as { id: string; name: string };

    return {
      id: decoded.id,
      name: decoded.name,
    };
  } catch (error) {
    return null;
  }
};
