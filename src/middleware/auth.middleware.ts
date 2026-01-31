import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface JwtPayload {
  id: string;
  email: string;
  rol: string;
}

export interface AuthRequest extends Request {
  usuario?: JwtPayload;
}

const JWT_SECRET: string = process.env.JWT_SECRET || "incubo_secret_key_desarrollo";

export function verificarToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Token no proporcionado" });
    return;
  }

  const token = authHeader.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ error: "Token no proporcionado" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as unknown as JwtPayload;
    req.usuario = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido o expirado" });
  }
}

export function verificarAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.usuario) {
    res.status(401).json({ error: "No autenticado" });
    return;
  }

  if (req.usuario.rol !== "admin") {
    res.status(403).json({ error: "Acceso denegado. Se requiere rol de administrador" });
    return;
  }

  next();
}

export function generarToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
}
