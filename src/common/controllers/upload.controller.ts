import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { put } from "@vercel/blob";

@Controller("uploads")
export class UploadController {
  @Post("image")
  @UseInterceptors(FileInterceptor("image"))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { folder: string }
  ) {
    try {
      const fileName = `${Date.now()}-${file.originalname}`;
      const folder = body.folder || "images";

      const blob = await put(`${folder}/${fileName}`, file.buffer, {
        access: "public",
        addRandomSuffix: true,
      });

      return { url: blob.url };
    } catch (error) {
      console.error("Error uploading to Vercel Blob:", error);
      throw new Error("Failed to upload image");
    }
  }
}
