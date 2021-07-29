const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const port = process.env.PORT || 5000;

var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

app.use(express.static('./public'));

io.on('connection', (socket) => {
    console.log('a user connected');
    

    socket.on('create game', () => {
        var id = "";
        for(let i = 0; i < 6; i++) {
            if(i >= 3) {
                id += Math.floor(Math.random() * 10);
            } else {
                id += characters.charAt(Math.floor(Math.random() * 
                characters.length));
            }
        }
        console.log(id);
    });

    socket.on('join game', (gameid) => {
        
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
