
// import "dotenv/config";
// import { connect } from "mongoose";

// async function dbConnect(){
//     const DB_URI = process.env.DB_URI
//     if(!DB_URI){
//         throw new Error("DB_URI is not defined");
//     }
//     await connect(DB_URI);
// }

// export default dbConnect;


import mongoose from "mongoose";

export interface IMongoConfig {
  uri: string;
}

export class Mongo {
  private uri: string;

  constructor(config: IMongoConfig) {
    this.uri = config.uri;
  }

  async connect(): Promise<void> {
    try {
      await mongoose.connect(this.uri);
      console.log("✅ Conectado a MongoDB");
    } catch (error) {
      console.error("❌ Error conectando a Mongo:", error);
      process.exit(1);
    }
  }

  async disconnect(): Promise<void> {
    await mongoose.disconnect();
    console.log("⚠️ Desconectado de MongoDB");
  }
}
