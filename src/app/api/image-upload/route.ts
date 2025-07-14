/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import { resolve } from 'path';


    
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
   } )

   interface CloudinaryUploadResponse{
    public_id: string;
    [key : string]: any; // Allow other properties
   }
    

   export async function POST(request : NextRequest)
   {
    if(!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        return NextResponse.json({message: "Cloudinary configuration is missing"}, {status: 500});
    }


    try {
       const formData= await request.formData();
       const file = formData.get('file') as File | null;

       if(!file) {
        return NextResponse.json({message: "No file provided"}, {status: 400});
       }

      const bytes= await file.arrayBuffer()
      const buffer= Buffer.from(bytes);

     const result = await new Promise<CloudinaryUploadResponse>( (resolve, reject) => {
       const uploadStream= cloudinary.uploader.upload_stream(
            {folder : "Jeevan-uploads", resource_type: 'auto'},
            (error, result) => {
                if(error) {
                    reject(error);
                } else {
                    resolve(result as CloudinaryUploadResponse);
                }
            }
        )
        uploadStream.end(buffer);
    })

    return NextResponse.json({
        publicId: result.public_id,
        url: result.secure_url,
        message: "File uploaded successfully",
    }, {status: 200});
    } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json({message: "File upload failed"}, {status: 500});
    }

   }
   
