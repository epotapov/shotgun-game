import React from 'react'
import { useState } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Link } from 'react-router-dom';

var GameMove = 0;
var reloaded = false;
var fired = false;
var aireloaded = false;

export default function App() {
    return(
        <Router>
            <Switch>
                <Route exact path="/">
                    <HomePage/> 
                </Route>
                <Route exact path="/gamepad">
                    <Gamepad/> 
                </Route> 
                <Route exact path="*">
                    <ErrorPage/> 
                </Route>
            </Switch>
        </Router>
    );
}
  
function HomePage() {
    //const [isGamepad, setGamepad] = useState(false);
    //if(isGamepad) 
    //    return <Gamepad/>;
    return (
        <div className='Container'>
            <section className="intro">
                <h1>/shotgun-game</h1>
                <div className="buttonholder">
                    <button type="button" >
                        <Link className="link" to="/gamepad">join game</Link>
                    </button>
                </div>
                <p>
                    This is shotgun-game. This is based on the rock, paper,
                    scissors <a href="https://www.wikihow.com/Play-the-Shotgun-Game" target="_blank" rel="noreferrer">style game</a>. 
                    You will be able to play this with a friend or by yourself. 
                </p>
            </section>
        </div>
    );
}


function ErrorPage() {
    return(
        <div className="Container">
            <button className="exitMarker">
                <Link className="link" to="/">
                    <p>x</p>
                </Link>
            </button>
            <h1>Error 404</h1>
        </div>
    );
}


function Gamepad() { 
    const gameid = 67900;
    const ButtonStyle = {backgroundColor: "#464545", borderColor:"#353434"};
    const ButtonStyleEnd = {backgroundColor: "#464545", borderColor:"#353434", pointerEvents:"none"};
    const NewButtonStyle = {backgroundColor: "#353434", borderColor:"white", pointerEvents:"none"};
    const [engageGame, startGame] = useState(false);
    const [shieldStyle, changeB1] = useState(ButtonStyleEnd);
    const [reloadStyle, changeB2] = useState(ButtonStyleEnd);
    const [hitStyle, changeB3] = useState(ButtonStyleEnd);
    const [gameDisplay, changeDis] = useState(5);

    function TimedDisplay (x, opponentMove) {
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
                    changeDis(timeleft);
                    var fiveSec = setInterval(() => {
                        timeleft--;
                        if(timeleft < 1) {
                            clearInterval(fiveSec);
                            resolve();
                        }
                        changeDis((prevSec)=>{return prevSec-1;});
                    }, 1000);
                }); 
        }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const reEnable = () => {
        changeB1(ButtonStyle);
        changeB2(ButtonStyle);
        if(fired)
            changeB3(ButtonStyleEnd);
        else if(reloaded)
            changeB3(ButtonStyle);
    }

    const disable = () => {
        changeB1(ButtonStyleEnd);
        changeB2(ButtonStyleEnd);
        changeB3(ButtonStyleEnd);
    }

    const ai = () => {
        let i = Math.floor(Math.random()*4);
        if(aireloaded)
            i = Math.floor(Math.random()*6);
        if(i >= 0 && i <= 2) 
            return 1;
        if(i === 3) {
            aireloaded = true;
            return 2;
        }
        if(i === 4 || i === 5) {
            aireloaded = false;
            return 3;
        }
    }

    const Gameplay = async () => {
        aireloaded = false;
        while(true) {
            GameMove = 0;
            reEnable();
            await TimedDisplay(5);
            disable();
            if(GameMove == 0) {
                await TimedDisplay(4);
                break;
            }
            let Aichoice = ai();
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
        startGame(false);
        disable();
    }

    //const [isGamepad, setGamepad] = useState(false);
    //if(isGamepad) 
    //    return <HomePage/>;
    return (
        <div className='Container'>
            <p className="idMarker">game id: {gameid}</p>
            <button className="exitMarker">
                <Link className="link" to="/">
                    <p>x</p>
                </Link>
            </button>
            <section className="game">
                {engageGame && <div className="buttonholder"><h2>{gameDisplay}</h2></div>}
                {!engageGame && <div className="buttonholder">
                    <button type="button" onClick={() => {
                        startGame(true);
                        Gameplay();
                    }}        
                    >start game</button>
                </div>}
                <section className="ActionButtons">
                    <button style={shieldStyle} 
                        onClick={() => {
                            GameMove = 1;
                            changeB1(NewButtonStyle);
                            changeB2(ButtonStyleEnd);
                            changeB3(ButtonStyleEnd);
                        }}
                        onMouseEnter={() => {
                            if(shieldStyle.backgroundColor !== "#353434")
                                changeB1({...shieldStyle, borderColor: "white"});
                        }}
                        onMouseLeave={() =>{
                            if(shieldStyle.backgroundColor !== "#353434")
                                changeB1({...shieldStyle, borderColor: "#353434"});
                        }}
                    >shield</button>
                    <button style={reloadStyle} 
                        onClick={() => {
                            GameMove = 2;
                            changeB1(ButtonStyleEnd);
                            changeB2(NewButtonStyle);
                            changeB3(ButtonStyleEnd);
                            reloaded = true;
                            fired = false;
                        }}
                        onMouseEnter={() => {
                            if(reloadStyle.backgroundColor !== "#353434")
                                changeB2({...reloadStyle, borderColor: "white"});

                        }}
                        onMouseLeave={() =>{
                            if(reloadStyle.backgroundColor !== "#353434")
                                changeB2({...reloadStyle, borderColor: "#353434"});
                        }}
                    >reload</button>
                    <button style={hitStyle} 
                        onClick={() => {
                            GameMove = 3;
                            changeB1(ButtonStyleEnd);
                            changeB2(ButtonStyleEnd);
                            changeB3(NewButtonStyle);
                            reloaded = false;
                            fired = true;
                        }}
                        onMouseEnter={() => {
                            if(hitStyle.backgroundColor !== "#353434") 
                                changeB3({...hitStyle, borderColor: "white"});
                        }}
                        onMouseLeave={() =>{
                            if(hitStyle.backgroundColor !== "#353434") 
                                changeB3({...hitStyle, borderColor: "#353434"});
                        }}
                    >hit</button>
                </section>
            </section>
        </div>
    );
}