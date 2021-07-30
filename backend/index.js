const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const port = process.env.PORT || 5000;

app.use(express.static('./public'));

var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const games = {};
//const users = {};

const createGame = (gameid, userid) => {
    games[gameid] = [userid];
}

const createId = () => {
    var id = "";
    for(let i = 0; i < 6; i++) {
        if(i < 3) {
            id += Math.floor(Math.random() * 10);
        } else {
            id += characters.charAt(Math.floor(Math.random() * 
            characters.length));
        }
    }
    return id;
}

const joinGame = (gameid, userid) => {
    games[gameid].push(userid);
}

const exitGame = (gameid, userid) => {
    if(games[gameid].length === 1) {
        delete games[gameid];
    } else {
        for(let i = 0; i < games[gameid].length; i++) {
            if(games[gameid][i] === userid) {
                games[gameid].splice(i, 1);
            }
        }
    }
}


io.on('connection', (socket) => {
    console.log('a user connected');
    

    socket.on('create game', () => { 
        var id = createId();
        while(games[id]) {
            id = createId();
        }
        createGame(id, socket.client.id);
        socket.emit('enter game', id);
        socket.join(id);
        console.log(id);
        console.log(games);
    });

    socket.on('join game', (gameid) => {
        if(!games[gameid] || (games[gameid].length === 2)) {
            socket.emit('display error');
        } else {
            joinGame(gameid, socket.client.id);
            socket.emit("joinRoomSuccess");
            socket.emit('enter player 2', gameid);
            socket.join(gameid);
            socket.broadcast.to(gameid).emit("full game");
            console.log(games);
        }
    });

    socket.on('start game', () => {
        
    });

    socket.on('leave game', () => {
        for(let id in games) {
            for(let i = 0; i < games[id].length; i++) {
                if(games[id][i] === socket.client.id) {
                    exitGame(id, socket.client.id);
                    if(games[id])
                        socket.broadcast.to(id).emit("player 2 leaves");
                    break;
                }
            }
        }
        console.log(games);
    });

    socket.on('disconnect', () => {
        for(let id in games) {
            for(let i = 0; i < games[id].length; i++) {
                if(games[id][i] === socket.client.id) {
                    exitGame(id, socket.client.id);
                    if(games[id])
                        socket.broadcast.to(id).emit("player 2 leaves");
                    break;
                }
            }
        }
        console.log(games);
        console.log('a user disconnected ');
    });
});

app.all('*', (req, res) => {
    res.status(404).send("<h1>Error<h1/>")
});

server.listen(port, () => {
    console.log('server is listening on port ' + port);
});