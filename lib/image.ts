"use client";

/** Read a File into a resized JPEG data URL (keeps IndexedDB light). */
export async function fileToDataUrl(file: File, maxSize = 1400): Promise<string> {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, maxSize / Math.max(bmp.width, bmp.height));
  const w = Math.round(bmp.width * scale), h = Math.round(bmp.height * scale);
  const cv = document.createElement("canvas");
  cv.width = w; cv.height = h;
  cv.getContext("2d")!.drawImage(bmp, 0, 0, w, h);
  return cv.toDataURL("image/jpeg", 0.9);
}
