import express from "express";
import http from "http";
import morgan from "morgan";
import { Server as SocketServer } from "socket.io";
import cors from "cors";

// Initializations
const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: "*",
  },
});

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));

io.on("connection", (socket) => {
  console.log(socket.id);

  //messages
  socket.on("message", (message) => {
    socket.broadcast.emit("message", {
      body: message.body,
      from: message.from,
    });
  });

  //Start game
  socket.on("startGame", () => {
    socket.broadcast.emit("startGame");
  });

  //ShowForm
  socket.on("showForm", () => {
    socket.broadcast.emit("showForm");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT);
console.log(`server on port ${PORT}`);
