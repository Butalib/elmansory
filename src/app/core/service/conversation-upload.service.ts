import { Injectable } from '@angular/core';
import { IConversationAttachment } from '../interface/IConversation';

@Injectable({
  providedIn: 'root',
})
export class ConversationUploadService {
  private readonly maxImageWidth = 1280;
  private readonly imageQuality = 0.72;

  async compressAndUpload(file: File): Promise<IConversationAttachment> {
    const normalizedFile = file.type.startsWith('image/')
      ? await this.compressImage(file)
      : file;

    return {
      id: crypto.randomUUID(),
      type: this.getAttachmentType(normalizedFile),
      name: normalizedFile.name || file.name,
      url: await this.readAsDataUrl(normalizedFile),
      mimeType: normalizedFile.type || file.type,
      size: file.size,
      compressedSize: normalizedFile.size,
    };
  }

  private async compressImage(file: File): Promise<File> {
    const image = await this.loadImage(file);
    const ratio = Math.min(1, this.maxImageWidth / image.width);
    const width = Math.round(image.width * ratio);
    const height = Math.round(image.height * ratio);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    if (!context) {
      return file;
    }

    context.drawImage(image, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', this.imageQuality);
    });

    if (!blob) {
      return file;
    }

    return new File([blob], this.toJpegName(file.name), {
      type: 'image/jpeg',
      lastModified: Date.now(),
    });
  }

  private loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = URL.createObjectURL(file);
    });
  }

  private readAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private getAttachmentType(file: File): IConversationAttachment['type'] {
    if (file.type.startsWith('video/')) {
      return 'video';
    }

    if (file.type.startsWith('audio/')) {
      return 'audio';
    }

    return 'image';
  }

  private toJpegName(name: string): string {
    return name.replace(/\.[^.]+$/, '') + '.jpg';
  }
}
