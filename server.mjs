import { createServer } from "node:http";
import { parse } from "node:url";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(httpServer, {
    path: "/api/socketio",
    addTrailingSlash: false,
    cors: { origin: process.env.NEXT_PUBLIC_APP_URL || "*", methods: ["GET", "POST"] },
  });

  global.__kurubis_io = io;

  io.on("connection", (socket) => {
    socket.on("join-admin", () => socket.join("admin"));
    socket.on("join-user", ({ userId }) => {
      if (userId) socket.join(`user:${userId}`);
    });
    socket.on("join-conversation", ({ conversationId }) => {
      if (conversationId) socket.join(`conversation:${conversationId}`);
    });
  });

  httpServer.listen(port, () => {
    console.log(`> Kurubis ready on http://${hostname}:${port}`);
    console.log(`> Socket.io on path /api/socketio`);
  });
});
