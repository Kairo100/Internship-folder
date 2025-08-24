import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
// import { ConfigService } from '@nestjs/config';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
// import { extname } from 'path';

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
}
