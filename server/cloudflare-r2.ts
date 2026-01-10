/**
 * Cloudflare R2 Storage Helper
 * 
 * Este arquivo fornece funções para upload e gerenciamento de arquivos no Cloudflare R2
 * via MCP (Model Context Protocol) do Cloudflare.
 * 
 * IMPORTANTE: Este código está preparado para funcionar com o MCP do Cloudflare.
 * Para usar em produção no Cloudflare Pages, você precisará configurar:
 * 1. Um bucket R2 no dashboard do Cloudflare
 * 2. Bindings do R2 no wrangler.toml ou configuração do Pages
 * 3. Ajustar este código para usar o binding direto do R2
 */

import { nanoid } from "nanoid";
import sharp from "sharp";

/**
 * Interface para resultado de upload
 */
export interface UploadResult {
  url: string;
  fileKey: string;
  filename: string;
  size: number;
  mimeType: string;
  width?: number;
  height?: number;
}

/**
 * Comprime uma imagem usando sharp
 */
export async function compressImage(
  buffer: Buffer,
  mimeType: string
): Promise<{ buffer: Buffer; width: number; height: number }> {
  const image = sharp(buffer);
  const metadata = await image.metadata();

  let compressed = image;

  // Redimensionar se for muito grande
  if (metadata.width && metadata.width > 2000) {
    compressed = compressed.resize(2000, undefined, {
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  // Comprimir baseado no tipo
  if (mimeType === "image/jpeg" || mimeType === "image/jpg") {
    compressed = compressed.jpeg({ quality: 85, progressive: true });
  } else if (mimeType === "image/png") {
    compressed = compressed.png({ compressionLevel: 8 });
  } else if (mimeType === "image/webp") {
    compressed = compressed.webp({ quality: 85 });
  }

  const compressedBuffer = await compressed.toBuffer();
  const compressedMetadata = await sharp(compressedBuffer).metadata();

  return {
    buffer: compressedBuffer,
    width: compressedMetadata.width || 0,
    height: compressedMetadata.height || 0,
  };
}

/**
 * Faz upload de um arquivo para o Cloudflare R2
 * 
 * NOTA: Esta é uma implementação de exemplo que usa o sistema de storage do Manus.
 * Para produção no Cloudflare Pages, você deve:
 * 1. Configurar um bucket R2 no Cloudflare
 * 2. Usar o binding do R2 diretamente no Workers/Pages
 * 3. Substituir esta implementação pela API nativa do R2
 */
export async function uploadToR2(
  file: Buffer,
  filename: string,
  mimeType: string,
  folder: string = "uploads"
): Promise<UploadResult> {
  // Gerar nome único para o arquivo
  const ext = filename.split(".").pop() || "";
  const uniqueFilename = `${nanoid()}.${ext}`;
  const fileKey = `${folder}/${uniqueFilename}`;

  let finalBuffer = file;
  let width: number | undefined;
  let height: number | undefined;

  // Comprimir se for imagem
  if (mimeType.startsWith("image/")) {
    try {
      const compressed = await compressImage(file, mimeType);
      finalBuffer = compressed.buffer;
      width = compressed.width;
      height = compressed.height;
    } catch (error) {
      console.warn("[R2] Failed to compress image, using original:", error);
    }
  }

  // IMPORTANTE: Em produção no Cloudflare Pages, substitua este código por:
  // 
  // const r2 = env.MY_BUCKET; // binding do R2
  // await r2.put(fileKey, finalBuffer, {
  //   httpMetadata: {
  //     contentType: mimeType,
  //   },
  // });
  // const url = `https://your-r2-domain.com/${fileKey}`;

  // Por enquanto, vamos simular o upload retornando uma URL local
  // Em produção, isso será substituído pela URL real do R2
  const url = `/uploads/${uniqueFilename}`;

  return {
    url,
    fileKey,
    filename: uniqueFilename,
    size: finalBuffer.length,
    mimeType,
    width,
    height,
  };
}

/**
 * Deleta um arquivo do Cloudflare R2
 */
export async function deleteFromR2(fileKey: string): Promise<void> {
  // IMPORTANTE: Em produção no Cloudflare Pages, substitua por:
  // 
  // const r2 = env.MY_BUCKET;
  // await r2.delete(fileKey);

  console.log(`[R2] Would delete file: ${fileKey}`);
}

/**
 * Lista arquivos de uma pasta no R2
 */
export async function listR2Files(prefix: string = ""): Promise<string[]> {
  // IMPORTANTE: Em produção no Cloudflare Pages, substitua por:
  // 
  // const r2 = env.MY_BUCKET;
  // const listed = await r2.list({ prefix });
  // return listed.objects.map(obj => obj.key);

  return [];
}

/**
 * Gera uma URL pública para um arquivo no R2
 */
export function getPublicUrl(fileKey: string): string {
  // IMPORTANTE: Em produção no Cloudflare Pages, substitua por:
  // return `https://your-r2-domain.com/${fileKey}`;

  return `/uploads/${fileKey}`;
}
