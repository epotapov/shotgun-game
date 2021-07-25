const express = require('express');

const app = express();
const port = process.env.PORT || 5000;

app.get("/",(req, res) => {
    res.json([{name:"pee"},{name:"poop"}])
});

app.get("/query", (req,res)=>{
    const {gameid} = req.query;
    let gameids = ["a;sldkfj","asssdfj","dkdkdk"];
    if(gameid) {
        gameide = gameids.find((gam) => {return gam === gameid});
    }
    console.log(gameide);
    if(gameide) {
        res.send('<h1>game id:<h1/>' + gameid);
    } else {
        res.status(404).send('<h1>error 404<h1/>');
    }
    
});

//app.use(express.static('./public'));


app.all('*', (req,res) => {
    res.status(404).send("<h1>Error 404</h1>");
});

app.listen(port, () => {
    console.log('server is listening on localhost ' + port);
});
