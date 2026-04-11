import express from "express";
import type { Application, Router } from "express";
import { Mongo } from "./MongoConfig.ts";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Options {
  port: number;
  routes: Router;
}


export class Server {


  private readonly mongo: Mongo;
  public readonly app: Application = express();
  private readonly port: number;
  private readonly router: Router;


  constructor(options: Options) {
    const { port = 3100, routes } = options;
    this.port = port;
    this.router = routes;
    this.config();
     // Inicializamos la clase de Mongo
    this.mongo = new Mongo({ uri: process.env.MONGO_URI! });
  }

  private config(): void {
    this.app.use(express.json({ limit: "1mb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "1mb" }));

    // Seguridad HTTP headers
    this.app.use(helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" }, // permite servir /uploads/ a otros origenes
    }));

    // Sanitizacion NoSQL injection
    // Express 5 define req.query como getter de solo lectura — sanitizamos solo body y params
    this.app.use((req, _res, next) => {
      if (req.body) mongoSanitize.sanitize(req.body);
      if (req.params) mongoSanitize.sanitize(req.params);
      next();
    });

    // Rate limiting
    this.app.use("/usuarios/login", rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 10,
      message: { error: "Demasiados intentos. Intentá de nuevo en 15 minutos." },
      standardHeaders: true,
      legacyHeaders: false,
    }));
    this.app.use("/mercadopago/crear-pago", rateLimit({
      windowMs: 60 * 1000, // 1 minuto
      max: 5,
      message: { error: "Demasiadas solicitudes de pago. Esperá un momento." },
      standardHeaders: true,
      legacyHeaders: false,
    }));
    this.app.use(rateLimit({
      windowMs: 60 * 1000, // 1 minuto
      max: 120,
      standardHeaders: true,
      legacyHeaders: false,
    }));

    // CORS
    const addWww = (url: string): string => {
      try {
        const u = new URL(url);
        if (!u.hostname.startsWith("www.")) {
          u.hostname = "www." + u.hostname;
          return u.origin;
        }
      } catch {}
      return "";
    };
    const webUrl = process.env.WEB_URL || "http://localhost:4321";
    const adminUrl = process.env.ADMIN_URL || "http://localhost:5173";
    const dev = "http://localhost:4321";
    const dev2 = "http://localhost:5173";
    const allowedOrigins = [
      webUrl,
      addWww(webUrl),
      adminUrl,
      addWww(adminUrl),
      dev,
      dev2
    ].filter(Boolean);
    this.app.use(cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error(`CORS: origen no permitido: ${origin}`));
        }
      },
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"]
    }));

    // Servir archivos estáticos desde uploads
    const uploadsPath = path.join(__dirname, "../uploads");
    this.app.use("/uploads", express.static(uploadsPath));
  }

  async start(): Promise<void> {
    // Conectamos a MongoDB
    await this.mongo.connect();
    this.app.use(this.router);
    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
}

export type { Options };
