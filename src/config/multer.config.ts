import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import sharp from "sharp";
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

// Middleware que convierte la imagen a WebP y la guarda en disco
export async function convertToWebp(req: Request, _res: Response, next: NextFunction) {
  if (!req.file) return next();

  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const filename = `producto-${uniqueSuffix}.webp`;
  const filePath = path.join(UPLOADS_DIR, filename);

  await sharp(req.file.buffer).webp({ quality: 85 }).toFile(filePath);

  req.file.filename = filename;
  req.file.path = filePath;

  next();
}

export const UPLOADS_PATH = UPLOADS_DIR;
