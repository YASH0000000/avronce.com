import { NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';

export async function GET() {
  try {
    const imagesDir = path.join(process.cwd(), 'public', 'images');
    const collectionsDir = path.join(imagesDir, 'collections');

    const result: Array<{ name: string; url: string; size: string; folder: string }> = [];

    // Main images
    try {
      const files = await fs.readdir(imagesDir, { withFileTypes: true });
      for (const file of files) {
        if (file.isFile() && /\.(webp|png|jpg|jpeg|svg)$/i.test(file.name)) {
          const stat = await fs.stat(path.join(imagesDir, file.name));
          result.push({
            name: file.name,
            url: `/images/${file.name}`,
            size: `${(stat.size / 1024).toFixed(1)} KB`,
            folder: 'images',
          });
        }
      }
    } catch {}

    // Collections
    try {
      const colFiles = await fs.readdir(collectionsDir, { withFileTypes: true });
      for (const file of colFiles) {
        if (file.isFile() && /\.(webp|png|jpg|jpeg|svg)$/i.test(file.name)) {
          const stat = await fs.stat(path.join(collectionsDir, file.name));
          result.push({
            name: file.name,
            url: `/images/collections/${file.name}`,
            size: `${(stat.size / 1024).toFixed(1)} KB`,
            folder: 'collections',
          });
        }
      }
    } catch {}

    return NextResponse.json({ success: true, count: result.length, media: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
