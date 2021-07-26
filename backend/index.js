const express = require('express');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.static('./public'));

/*
app.get("/",(req, res) => {
    res.send("<h1>homepage<h1/>")
});
*/

app.get("/game", (req,res)=>{
    const {id} = req.query;
    console.log(id)
    let gameids = ["asldkfj","asssdfj","dkdkdk","asdlkfj"];
    var gameide;
    if(id) {
        gameide = gameids.find((gam) => {return gam === id});
    }
    if(gameide) {
        return res.send('<h1>game id:<h1/>' + id);
    }
    return res.status(404).send('<h1>error 404<h1/>');
});

/*app.all('*', (req,res) => {
    res.status(404).send("<h1>Error 404</h1>");
});*/

app.listen(port, () => {
    console.log('server is listening on localhost ' + port);
});
