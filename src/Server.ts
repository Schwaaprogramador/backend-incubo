import express from "express";
import type { Application, Router } from "express";
import { Mongo } from "./MongoConfig.ts";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
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
    this.app.use(express.json());

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
