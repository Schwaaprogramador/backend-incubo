import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/backend_incubo";

const UsuarioSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  nombre: { type: String, required: true, trim: true },
  rol: { type: String, enum: ["admin", "usuario"], default: "usuario" },
  activo: { type: Boolean, default: true },
}, { timestamps: true });

const Usuario = mongoose.model("Usuario", UsuarioSchema);

async function createAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Conectado a MongoDB");

    const adminEmail = "admin@incubo.com";
    const adminPassword = "admin123";

    const existente = await Usuario.findOne({ email: adminEmail });

    if (existente) {
      console.log("El usuario admin ya existe:");
      console.log(`  Email: ${existente.email}`);
      console.log(`  Nombre: ${existente.nombre}`);
      console.log(`  Rol: ${existente.rol}`);
    } else {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      const admin = new Usuario({
        email: adminEmail,
        password: hashedPassword,
        nombre: "Administrador",
        rol: "admin",
        activo: true,
      });

      await admin.save();
      console.log("Usuario admin creado exitosamente:");
      console.log(`  Email: ${adminEmail}`);
      console.log(`  Password: ${adminPassword}`);
      console.log(`  Rol: admin`);
    }

    await mongoose.disconnect();
    console.log("Desconectado de MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

createAdmin();
