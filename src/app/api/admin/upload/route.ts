import { NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, error: 'No files uploaded' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'images', 'uploads');
    let isFileSystemWritable = true;
    try {
      await fs.mkdir(uploadDir, { recursive: true });
    } catch (dirErr: any) {
      if (dirErr.code === 'EROFS' || dirErr.code === 'EPERM' || dirErr.code === 'EACCES') {
        isFileSystemWritable = false;
      }
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        continue;
      }

      // Max size: 5MB
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json({ success: false, error: `File ${file.name} exceeds 5MB limit` }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      if (isFileSystemWritable) {
        try {
          // Safe clean filename
          const ext = path.extname(file.name) || '.webp';
          const cleanBase = path.basename(file.name, ext).replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();
          const uniqueName = `${cleanBase}-${Date.now()}${ext}`;

          const filePath = path.join(uploadDir, uniqueName);
          await fs.writeFile(filePath, buffer);

          uploadedUrls.push(`/images/uploads/${uniqueName}`);
          continue;
        } catch (writeErr: any) {
          if (writeErr.code === 'EROFS' || writeErr.code === 'EPERM' || writeErr.code === 'EACCES') {
            isFileSystemWritable = false;
          } else {
            throw writeErr;
          }
        }
      }

      // Fallback for serverless read-only filesystem (Vercel / AWS Lambda):
      // Convert buffer directly into an inline Base64 Data URL so images display everywhere
      const mimeType = file.type || 'image/jpeg';
      const base64Data = buffer.toString('base64');
      uploadedUrls.push(`data:${mimeType};base64,${base64Data}`);
    }

    return NextResponse.json({ success: true, urls: uploadedUrls });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
