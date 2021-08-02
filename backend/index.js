const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
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

const gameChoiceDisplay = (choice) => {
    switch(choice) {
        case 1:
            return "opponent: shield"
        case 2:
            return "opponent: reload"
        case 3:
            return "opponent: hit"
    }
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
        createGame(id, socket.id);
        createMove(socket.id);
        socket.emit('enter game', id);
        socket.join(id);
        console.log(id);
        console.log(socket.id)
        console.log(games);
    });

    socket.on('join game', (gameid) => {
        if(!games[gameid] || (games[gameid].length === 2)) {
            socket.emit('display error');
        } else {
            joinGame(gameid, socket.id);
            createMove(socket.id);
            socket.emit('joinRoomSuccess');
            socket.emit('enter player 2', gameid);
            socket.join(gameid);
            console.log(socket.id)
            socket.broadcast.to(gameid).emit('full game');
            console.log(games);
        }
    });

    const TimedDisplay = (x, id, user1, user2) => {
        switch(x) {
            case 1: // No action game goes on
                return new Promise(resolve => {
                    console.log(socket.id)
                    io.to(user1).emit('display', gameChoiceDisplay(userChoice[user2]));
                    io.to(user2).emit('display', gameChoiceDisplay(userChoice[user1]));
                    //io.in(id).emit('display-user', user1, gameChoiceDisplay(userChoice[user1]), user2, gameChoiceDisplay(userChoice[user1]));
                    /*for(let i = 0; i < games[id].length; i++) {
                        if(socket.id !== games[id][i]) {
                            socket.emit('display', gameChoiceDisplay(userChoice[games[id][i]]));
                        }
                    }
                    console.log(user2)
                    console.log(socket.id)
                    console.log(user1)
                    if(socket.id === user1) {
                        socket.emit('display', gameChoiceDisplay(userChoice[user2]));
                        io.to(user2).emit('display', gameChoiceDisplay(userChoice[user1]));
                    } else if (socket.id === user2) {
                        socket.emit('display', gameChoiceDisplay(userChoice[user1]));
                        io.to(user1).emit('display', gameChoiceDisplay(userChoice[user2]));
                    }*/
                    setTimeout(resolve, 2000);
                });
            case 2: //someone won
                return new Promise(resolve => {
                    io.to(user1).emit('display', "you won");
                    io.to(user2).emit('display', "you lost");
                    setTimeout(resolve, 2000);
                });    
            case 3:
                return new Promise(resolve => {
                    io.in(id).emit('display', "game tied"); 
                    setTimeout(resolve, 2000);
                });   
            case 4:
                return new Promise(resolve => {
                    io.in(id).emit('display', "game ended due to inactivity");
                    setTimeout(resolve, 2000);
                });   
            case 5:
                return new Promise(resolve => {
                    var timeleft = 5
                    io.in(id).emit('display', timeleft);
                    var fiveSec = setInterval(() => {
                        timeleft--;
                        if(timeleft < 1) {
                            clearInterval(fiveSec);
                            resolve();
                        }
                        io.in(id).emit('display', timeleft);
                    }, 1000);
                }); 
        }
    }

    socket.on('start game', async (id) => {
        io.in(id).emit('init game');
        while(true) {
            createMove(socket.id);
            io.in(id).emit('enable');
            await TimedDisplay(5, id);
            io.in(id).emit('disable');
            if(userChoice[games[id][0]] === 0 || userChoice[games[id][1]] === 0) {
                await TimedDisplay(4, id);
                break;
            }
            if(userChoice[games[id][0]] === 3 && userChoice[games[id][1]] === 3) {
                await TimedDisplay(3, id);
                break;
            }
            if(userChoice[games[id][0]] === 3 && userChoice[games[id][1]] === 2) {
                await TimedDisplay(2, id, games[id][0], games[id][1]);
                break;
            } if(userChoice[games[id][1]] === 3 && userChoice[games[id][0]] === 2) {
                await TimedDisplay(2, id, games[id][1], games[id][0]);
                break; 
            } else {
                await TimedDisplay(1, id, games[id][0], games[id][1]);
            }
        }
        io.in(id).emit('full game');
        io.in(id).emit('disable');
    });

    socket.on('make move', (move) => {
        userChoice[socket.id] = move;
    });

    const leave = () => {
        for(let id in games) {
            for(let i = 0; i < games[id].length; i++) {
                if(games[id][i] === socket.id) {
                    exitGame(id, socket.id);
                    deleteUser(socket.id);
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
    res.status(404).sendFile(path.resolve(__dirname, './errorPage/error.html'))
});

server.listen(port, () => {
    console.log('server is listening on port ' + port);
});