import http from "http";
import WebSocket from "ws";
import express from "express";
import { stringify } from "querystring";
import { parse } from "path";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log("✅ Listening on http://localhost:3000");
// app.listen(3000, handleListen);
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const sockets = [];

wss.on("connection", (socket) => {
  console.log("connected to Browser ✅");
  sockets.push(socket);
  socket["nickname"] = "Anonymous";
  socket.on("close", () => console.log("Disconnected from the Brower 🔴"));
  socket.on("message", (message) => {
    const parsedMessage = JSON.parse(message.toString("utf-8"));
    switch (parsedMessage.type) {
      case "new_message":
        socket["payload"] = parsedMessage.payload;
        sockets.forEach((aSocket) =>
          aSocket.send(`${socket.nickname}:${socket.payload}`)
        );
        break;
      case "nickname":
        socket["nickname"] = parsedMessage.payload;
        break;
    }
    // console.log(socket);
  });
});
server.listen(3000, handleListen);
