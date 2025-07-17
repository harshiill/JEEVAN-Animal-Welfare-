/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// GET: Fetch gallery images
export async function GET() {
  try {
    const { resources } = await cloudinary.search
      .expression("folder:jeevan")
      .sort_by("created_at", "desc")
      .max_results(30)
      .execute();

    const images = resources.map((img: any) => ({
      src: img.secure_url,
      title:
        img.public_id.split("/").pop()?.replace(/[-_]/g, " ") || "Gallery Image",
    }));

    return NextResponse.json({ success: true, images });
  } catch (error) {
    console.error("Cloudinary fetch error:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}

// POST: Upload new image
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "jeevan",
          use_filename: true,
          unique_filename: true,
        },
        (error, result) => {
          if (error || !result) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      uploadStream.end(buffer);
    });

    return NextResponse.json({ success: true, url: result.secure_url });
  } catch (err) {
    console.error("Upload Error:", err);
    return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
  }
}
