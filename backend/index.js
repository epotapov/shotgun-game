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
    

    socket.on('create game', () => { 
        var id = "";
        for(let i = 0; i < 6; i++) {
            if(i < 3) {
                id += Math.floor(Math.random() * 10);
                console.log("what up")
            } else {
                id += characters.charAt(Math.floor(Math.random() * 
                characters.length));
                console.log("what down")
            }
        } 
        while(games[id]) {
            id = "";
            for(let i = 0; i < 6; i++) {
                if(i < 3) {
                    id += Math.floor(Math.random() * 10);
                    console.log("what up")
                } else {
                    id += characters.charAt(Math.floor(Math.random() * 
                    characters.length));
                    console.log("what down")
                }
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
            socket.emit('display error');
        } else {
            joinGame(gameid);
            socket.emit("joinRoomSuccess");
            socket.emit('enter player 2', gameid);
            socket.join(gameid);
            socket.broadcast.to(gameid).emit("full game");
            console.log(games);
        }
    });

    socket.on('start game', () => {
        
    });

    socket.on('disconnect', () => {
        console.log('a user disconnected ');
    });
});

app.all('*', (req, res) => {
    res.send("<h1>Error<h1/>")
});

server.listen(port, () => {
    console.log('server is listening on localhost ' + port);
});
