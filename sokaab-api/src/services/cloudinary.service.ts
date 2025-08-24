import { Injectable , InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
// import { ConfigService } from '@nestjs/config';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
// import { extname } from 'path';

// <--- DEFINE THIS INTERFACE HERE ---
export interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  
}


@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(
    file: Express.Multer.File,
    fileName: string,
    projectId: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: `Sokaab/${projectId}/project_images/`,
            resource_type: 'image',
            public_id: fileName, // Set the Cloudinary file name
            overwrite: true,
          },
          (error, result: any) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          },
        )
        .end(file.buffer);
    });
  }

  async deleteImage(imageUrl: string, projectId: string): Promise<void> {
    try {
      // Extract the filename from the URL
      const fileName = imageUrl.split('/').pop()?.split('.')[0];

      if (!fileName) {
        console.error('Failed to extract file name from URL:', imageUrl);
        return;
      }

      // Construct the full Cloudinary public_id
      const publicId = `Sokaab/${projectId}/project_images/${fileName}`;
      console.log('Deleting from Cloudinary:', publicId);

      const result = await cloudinary.uploader.destroy(publicId);
      console.log('Cloudinary delete response:', result);
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
    }
  }
  
  // --- NEW METHOD FOR GENERAL DOCUMENTS ---
  async uploadFile(
    fileBuffer: Buffer,
    options: Record<string, any> = {}, // Cloudinary upload options (e.g., folder, resource_type, public_id)
  ): Promise<CloudinaryResponse> {
    return new Promise((resolve, reject) => {
      // Use upload_stream for buffer uploads
      cloudinary.uploader.upload_stream(
        options, // Pass the options directly
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error) {
            console.error('Cloudinary file upload error:', error);
            return reject(new InternalServerErrorException('Cloudinary file upload failed.'));
          }
          if (!result) {
            return reject(new InternalServerErrorException('Cloudinary did not return a result for file upload.'));
          }
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        },
      ).end(fileBuffer); // Pass the file buffer to the stream
    });
  }
}















