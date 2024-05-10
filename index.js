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

  var players = [];

  //messages
  socket.on("message", (message) => {
    console.log("Llegó un mensaje");
    socket.broadcast.emit("message", {
      body: message.body,
      from: message.from,
    });
    if (players.length > 0) {
      if (!players.some((player) => player.id == message.from)) {
        players.push({
          id: message.from,
          hidden: null,
        });
        console.log("se registro el jugador: ", message.from);
        socket.broadcast.emit("registerPlayer", {
          id: message.from,
          hidden: null,
        });
      } else {
        console.log("El jugador ya está registrado");
      }
    } else {
      players.push({
        id: message.from,
        hidden: 0,
      });
      console.log("se registro el jugador: ", message.from);
      socket.broadcast.emit("registerPlayer", {
        id: message.from,
        hidden: null,
      });
    }
  });

  //Start game
  socket.on("startGame", () => {
    socket.broadcast.emit("startGame");
  });

  //ShowForm
  socket.on("showForm", () => {
    socket.broadcast.emit("showForm");
  });

  //ShowGame
  socket.on("showGame", () => {
    socket.broadcast.emit("showGame");
  });

  //ShowPlayers
  socket.on("showPlayers", () => {
    socket.broadcast.emit("showPlayers", players);
    console.log(players);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT);
console.log(`server on port ${PORT}`);
