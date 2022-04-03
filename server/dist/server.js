"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var http_1 = __importDefault(require("http"));
var socket_io_1 = require("socket.io");
var users_1 = require("./util/users");
var app = express_1.default();
var server = http_1.default.createServer(app);
var io = new socket_io_1.Server(server, { cors: { origin: "http://localhost:3000" } });
io.on("connection", function (socket) {
    socket.join("myChat");
    socket.on("handle-connection", function (username) {
        if (!users_1.userJoin(socket.id, username)) {
            socket.emit("username-taken");
        }
        else {
            socket.emit("username-submitted-successfully");
            io.to("myChat").emit("get-connected-users", users_1.getUsers());
        }
    });
    socket.on("message", function (message) {
        socket.broadcast.to("myChat").emit("receive-message", message);
    });
    socket.on("disconnect", function () {
        users_1.userLeft(socket.id);
    });
});
server.listen(5000, function () { return console.log("Server started on port 5000..."); });
