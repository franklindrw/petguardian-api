import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import * as mime from 'mime-types';

@Injectable()
export class StorageService {
  private readonly bucketName = 'petguardian-d3db6.appspot.com';
  private storage = new Storage({
    credentials: JSON.parse(process.env.FIREBASE),
  });

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const bucket = this.storage.bucket(this.bucketName);
    const blob = bucket.file(file.originalname);

    // cria um stream para o arquivo
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    // faz o upload do arquivo
    return new Promise((resolve, reject) => {
      blobStream.on('error', (err) => {
        reject(err);
      });

      blobStream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${file.originalname}`;
        resolve(publicUrl);
      });

      blobStream.end(file.buffer);
    });
  }

  async isImageValid(file: Express.Multer.File): Promise<boolean> {
    const mimeType = mime.contentType(file.originalname);

    // verifica se o arquivo é uma imagem
    if (mimeType && mimeType.startsWith('image/')) {
      return true;
    }

    return false;
  }
}
