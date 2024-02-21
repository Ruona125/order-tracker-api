import http from "http";
import app from "./src/app";

const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 8000;
const server = http.createServer(app);

server.listen(PORT, '0.0.0.0', () => {
  console.log("listeing to port 8000");
});
 