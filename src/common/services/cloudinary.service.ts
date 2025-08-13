import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cloudinary from 'cloudinary';

export interface CloudinaryUploadResult {
  publicId: string;
  url: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
  resourceType: string;
  bytes: number;
}

export interface SignedUploadParams {
  timestamp: number;
  signature: string;
  apiKey: string;
  folder?: string;
  publicId?: string;
  cloudName?: string;
}

@Injectable()
export class CloudinaryService {
  private cloudinaryInstance: typeof cloudinary.v2;

  constructor(private configService: ConfigService) {
    this.cloudinaryInstance = cloudinary.v2;
    
    this.cloudinaryInstance.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  /**
   * Generate signed upload parameters for client-side uploads
   */
  generateSignedUploadParams(folder: string = 'paan-posts', publicId?: string): SignedUploadParams {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const params: any = {
      timestamp,
      folder,
    };

    if (publicId) {
      params.public_id = publicId;
    }

    const signature = this.cloudinaryInstance.utils.api_sign_request(
      params,
      this.configService.get<string>('CLOUDINARY_API_SECRET')
    );

    return {
      timestamp,
      signature,
      apiKey: this.configService.get<string>('CLOUDINARY_API_KEY'),
      folder,
      cloudName: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      publicId,
    };
  }

  /**
   * Upload file directly from server (for fallback or server-side processing)
   */
  async uploadFile(file: Express.Multer.File | Buffer | string): Promise<any> {
    return this.cloudinaryInstance.uploader.upload(file as string);
  }

  /**
   * Delete file from Cloudinary
   */
  async deleteFile(publicId: string, resourceType: 'image' | 'video' | 'raw' = 'image'): Promise<void> {
    return new Promise((resolve, reject) => {
      this.cloudinaryInstance.uploader.destroy(publicId, { resource_type: resourceType }, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Get Cloudinary configuration for client
   */
  getClientConfig() {
    return {
      cloudName: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      uploadPreset: this.configService.get<string>('CLOUDINARY_UPLOAD_PRESET'),
    };
  }
}
