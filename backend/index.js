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
const userChoice = {};

const createGame = (gameid, userid) => {
    games[gameid] = [userid];
}

const createMove = (user) => {
    userChoice[user] = 0;
}

const deleteUser = (user) => {
    delete userChoice[user];
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
        createMove(socket.client.id);
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
            createMove(socket.client.id);
            socket.emit('joinRoomSuccess');
            socket.emit('enter player 2', gameid);
            socket.join(gameid);
            socket.broadcast.to(gameid).emit('full game');
            console.log(games);
        }
    });

    function TimedDisplay (x, opponentMove, id) {
        switch(x) {
            case 1:
                return new Promise(resolve => {
                    switch(opponentMove) {
                        case 1:
                            changeDis("Opponent: Shield");
                            setTimeout(resolve, 2000); 
                            break;
                        case 2:
                            changeDis("Opponent: Reload");
                            setTimeout(resolve, 2000);
                            break;
                        default:
                            changeDis("Opponent: Hit");
                            setTimeout(resolve, 2000);
                            break;
                    }
                    
                });
            case 2:
                return new Promise(resolve => {
                    changeDis("You won");
                    setTimeout(resolve, 2000);
                });    
            case 3:
                return new Promise(resolve => {
                    changeDis("You Lost");
                    setTimeout(resolve, 2000);
                });   
            case 4:
                return new Promise(resolve => {
                    changeDis("You didn't do anything");
                    setTimeout(resolve, 2000);
                });   
            case 5:
                return new Promise(resolve => {
                    var timeleft = 5
                    socket.broadcast.to(id).emit('display', timeleft);
                    var fiveSec = setInterval(() => {
                        timeleft--;
                        if(timeleft < 1) {
                            clearInterval(fiveSec);
                            resolve();
                        }
                        socket.broadcast.to(id).emit('display', timeleft);
                    }, 1000);
                }); 
        }
    }

    socket.on('start game', async (id) => {
        socket.broadcast.to(id).emit('init game');
        while(true) {
            createMove(socket.client.id);
            socket.broadcast.to(id).emit('enable');
            await TimedDisplay(5);
            socket.broadcast.to(id).emit('disable');
            if(GameMove === 0) {
                await TimedDisplay(4);
                break;
            }
            let Aichoice = ai(); //implement the deciding thing for the thing
            console.log(Aichoice);
            if(GameMove === 3 && (Aichoice === 2 || Aichoice === 3)) {
                await TimedDisplay(2);
                break;
            } else if (Aichoice === 3 && GameMove === 2) {
                await TimedDisplay(3);
                break;
            } else {
                await TimedDisplay(1, Aichoice);
            }
        }
        socket.broadcast.to(id).emit('full game');
        socket.broadcast.to(id).emit('disable');
    });

    socket.on('make move', (move) => {
        userChoice[socket.client.id] = move;
    });

    const leave = () => {
        for(let id in games) {
            for(let i = 0; i < games[id].length; i++) {
                if(games[id][i] === socket.client.id) {
                    exitGame(id, socket.client.id);
                    deleteUser(socket.client.id);
                    if(games[id])
                        socket.broadcast.to(id).emit("player 2 leaves");
                    break;
                }
            }
        }
    }

    socket.on('leave game', () => {
        leave();
        console.log(games);
    });

    socket.on('disconnect', () => {
        leave();
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