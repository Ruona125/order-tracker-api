import http from "http";
import app from "./src/app";

const PORT: number = 8000;
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log("listeing to port 8000");
});
 