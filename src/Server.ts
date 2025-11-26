import express from "express";
import type { Application, Router, Request, Response } from "express";
import { Mongo } from "./MongoConfig.ts";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";




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

    // <-- INTEGRA CORS AQUÍ (antes de las rutas)
    this.app.use(cors({
      origin: "*", // Permite todos los orígenes (puedes cambiarlo por un dominio específico)
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"]
    }));
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
