import { AppRoutes } from "./src/Routes.js";
import { Server } from "./src/Server.js";

(async function main() {
  const server = new Server({
    port: 3100,
    routes: AppRoutes.routes
  });

  await server.start();
})();
