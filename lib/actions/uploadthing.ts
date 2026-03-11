// lib/actions/uploadthing.ts
"use server";

import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function deleteFileFromUT(url: string) {
  try {
    // Kita ambil 'fileKey' dari URL UploadThing
    // Format biasanya: https://utfs.io/f/FILE_KEY
    const fileKey = url.split("/f/")[1];
    
    if (fileKey) {
      await utapi.deleteFiles(fileKey);
      return { success: true };
    }
  } catch (error) {
    console.error("Gagal hapus file di UT:", error);
    return { success: false };
  }
}