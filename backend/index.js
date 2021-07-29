const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const port = process.env.PORT || 5000;

var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const games = {};
//const users = {};

const createGame = (gameid) => {
    games[gameid] = 1;
}

const joinGame = (gameid) => {
    games[gameid] = 2;
}

app.use(express.static('./public'));

io.on('connection', (socket) => {
    console.log('a user connected');
    

    socket.on('create game', () => { //work on checking game id duplicates
        var id = "";
        for(let i = 0; i < 6; i++) {
            if(i >= 3) {
                id += Math.floor(Math.random() * 10);
            } else {
                id += characters.charAt(Math.floor(Math.random() * 
                characters.length));
            }
        }
        createGame(id);
        socket.emit('enter game', id);
        socket.join(id);
        console.log(id);
        console.log(games);
    });

    socket.on('join game', (gameid) => {
        if(!games[gameid]) {
            //const error = "This room doesn't exist";
            //socket.emit("display-error", error);
            console.log("room doesn't exist");
        } else {
            joinGame(gameid);
            socket.emit('enter player 2', id);
            socket.join(gameid);
            socket.broadcast.to(gameid).emit("full game");
            console.log(socket);
        }
    });

    socket.on('start game', () => {
        
    });

    socket.on('disconnect', () => {
        console.log('a user disconnected ');
    });
});

server.listen(port, () => {
    console.log('server is listening on localhost ' + port);
});
