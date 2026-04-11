import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import sharp from "sharp";
import { fileTypeFromBuffer } from "file-type";
import type { Request, Response, NextFunction } from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directorio base para uploads (relativo a la raíz del proyecto)
const UPLOADS_DIR = path.join(__dirname, "../../uploads/productos");

// Asegurar que el directorio existe
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Filtro de archivos (solo imágenes)
const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Tipo de archivo no permitido. Solo se permiten imágenes (jpg, jpeg, png, gif, webp)"));
  }
};

// Multer con memory storage para procesar con sharp antes de guardar
export const uploadProducto = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máximo
  },
});

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

async function validarMagicBytes(buffer: Buffer): Promise<void> {
  const tipo = await fileTypeFromBuffer(buffer);
  if (!tipo || !ALLOWED_MIME_TYPES.includes(tipo.mime)) {
    throw new Error(`Tipo de archivo no permitido. Solo se aceptan imágenes JPG, PNG, GIF o WebP.`);
  }
}

// Middleware que convierte la imagen a WebP y la guarda en disco (una sola)
export async function convertToWebp(req: Request, res: Response, next: NextFunction) {
  if (!req.file) return next();

  try {
    await validarMagicBytes(req.file.buffer);

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = `producto-${uniqueSuffix}.webp`;
    const filePath = path.join(UPLOADS_DIR, filename);

    await sharp(req.file.buffer).webp({ quality: 85 }).toFile(filePath);

    req.file.filename = filename;
    req.file.path = filePath;

    next();
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Archivo inválido" });
  }
}

// Middleware que convierte múltiples imágenes a WebP y las guarda en disco
export async function convertToWebpArray(req: Request, res: Response, next: NextFunction) {
  if (!req.files || !Array.isArray(req.files) || req.files.length === 0) return next();

  try {
    for (const file of req.files as Express.Multer.File[]) {
      await validarMagicBytes(file.buffer);

      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const filename = `producto-${uniqueSuffix}.webp`;
      const filePath = path.join(UPLOADS_DIR, filename);

      await sharp(file.buffer).webp({ quality: 85 }).toFile(filePath);

      file.filename = filename;
      file.path = filePath;
    }

    next();
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Archivo inválido" });
  }
}

export const UPLOADS_PATH = UPLOADS_DIR;
