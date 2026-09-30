import { createReadStream } from "node:fs";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";

const index = fileURLToPath(new URL("./index.html", import.meta.url));
const port = Number(process.env.PORT ?? process.env.OPERATOR_UI_PORT ?? 5173);

createServer((request, response) => {
  if (request.url !== "/" && request.url !== "/index.html") {
    response.writeHead(404).end("Not found");
    return;
  }
  response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
  createReadStream(index).pipe(response);
}).listen(port, "0.0.0.0", () => console.log(`operator-ui listening on http://localhost:${port}`));
