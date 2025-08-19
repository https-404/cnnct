import sharp from "sharp";

export const compressImage = async (fileBuffer: Buffer): Promise<Buffer> => {
  return sharp(fileBuffer)
    .resize(500, 500, { fit: "cover" }) 
    .jpeg({ quality: 80 })             
    .toBuffer();
};
    