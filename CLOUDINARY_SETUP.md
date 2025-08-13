# Cloudinary Setup for PAAN Server

## Prerequisites
1. Create a Cloudinary account at [cloudinary.com](https://cloudinary.com)
2. Get your Cloud Name, API Key, and API Secret from your dashboard

## Environment Variables
Add the following environment variables to your `.env` file:

```bash
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

## Upload Preset Setup
1. Go to your Cloudinary Dashboard
2. Navigate to Settings > Upload
3. Create a new upload preset with the following settings:
   - **Name**: `paan-uploads` (or your preferred name)
   - **Signing Mode**: `Unsigned` (for client-side uploads) or `Signed` (for server-side validation)
   - **Folder**: `paan-posts`
   - **Allowed Formats**: `jpg`, `jpeg`, `png`, `gif`, `webp`
   - **Max File Size**: Set appropriate limit (e.g., 10MB)
   - **Transformations**: Add any default transformations you want

## Security Considerations
- **Signed Uploads**: More secure, requires server-side signature generation
- **Unsigned Uploads**: Simpler but less secure, good for development
- **Folder Restrictions**: Always restrict uploads to specific folders
- **File Type Validation**: Restrict to image formats only
- **Size Limits**: Set reasonable file size limits

## Usage
The Cloudinary service provides:
- `generateSignedUploadParams()`: Generate signed upload parameters for client-side uploads
- `uploadFile()`: Direct server-side file uploads
- `deleteFile()`: Delete files from Cloudinary

## Client-Side Integration
The mobile app will:
1. Get signed upload parameters from `/api/v1/feed/upload-params`
2. Upload images directly to Cloudinary using these parameters
3. Send the resulting Cloudinary URLs to the post creation endpoint

## Testing
Test the setup by:
1. Starting the server with proper environment variables
2. Calling the `/api/v1/feed/upload-params` endpoint
3. Verifying the response contains valid Cloudinary parameters
