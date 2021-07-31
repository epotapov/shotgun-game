import React from 'react'
import { useState , useEffect } from 'react'
//import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
//import { Link } from 'react-router-dom';
import {io} from "socket.io-client";


var GameMove = 0;
var reloaded = false;
var fired = false;
var aireloaded = false;

const socket = io();

export default function App() {
    const [component, SwitchComp] = useState(1);
    if(component === 1)
        return <HomePage/>;
    else if(component === 2)
        return <Gamepad/>;

    
    function HomePage() {
        const [input, setInput] = useState();
        const [errorBool, setError] = useState(false);

        useEffect(() => {
            socket.on('display error', () => setError(true));
            socket.on('joinRoomSuccess', () => SwitchComp(2));
        }, []);

        return ( //fix ui for mobile
            <div className='Container'>
                <section className="intro">
                    <h1>/shotgun-game</h1>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        socket.emit('join game', input);
                    }}>
                        <section id="InputHolder">
                            <input 
                                type="text" 
                                placeholder="game id" 
                                value={input}
                                onChange={(e) => { //figure out issue with controlled input
                                    setInput(e.target.value);
                                }}
                                />
                        </section>
                        <div className="buttonholder">
                            <button type="submit">
                                join game
                            </button>
                        </div>
                        <div className="ErrorMessage">
                            {errorBool && <p>couldn't connect to game</p>}
                        </div>
                    </form>
                    <p>
                        Rules:
                    </p>
                    <ul>
                        <li>Every five seconds players pick:</li>
                        <ul>
                            <li>Shield</li>
                            <li>Reload</li>
                            <li>Hit (Reload to Pick)</li>
                        </ul>
                        <li>Shield proctects against hits</li>
                        <li>Wins are obtained through unguarded hits (Hit a reloading player)</li>
                        <li>Ties are when both hit each other</li>
                    </ul>
                    <div className="buttonholder">
                        <button type="button" onClick={() => {
                            SwitchComp(2);
                            socket.emit('create game');
                        }}>
                            create game
                        </button>
                    </div>
                </section>
            </div>
        );
    }

    //probably not going to use
    function ErrorPage() {
        return(
            <div className="Container">
                <button className="exitMarker">
                    x
                </button>
                <h1>Error 404</h1>
            </div>
        );
    }


    function Gamepad() { 
        const ButtonStyle = {backgroundColor: "#464545", borderColor:"#353434"};
        const ButtonStyleEnd = {backgroundColor: "#464545", borderColor:"#353434", pointerEvents:"none"};
        const NewButtonStyle = {backgroundColor: "#353434", borderColor:"white", pointerEvents:"none"};
        const waiting = "waiting for opponent"
        const [gameid, initGameid] = useState();
        const [engageGame, startText] = useState(false);
        const [shieldStyle, changeB1] = useState(ButtonStyleEnd);
        const [reloadStyle, changeB2] = useState(ButtonStyleEnd);
        const [hitStyle, changeB3] = useState(ButtonStyleEnd);
        const [gameDisplay, changeDis] = useState(waiting);

        useEffect(() => {

            socket.on('enter game', (id) => {
                initGameid(id);
                startText(true);
            });

            socket.on('enter player 2', (id) => {
                initGameid(id);
            });

            socket.on('player 2 leaves', () => {
                startText(true);
                changeDis(waiting)
            });

            socket.on('full game', () => {
                startText(false);
            });

            socket.on('init game', () => {
                startText(true);
            });

            socket.on('enable', () => reEnable());

            socket.on('disable', () => disable());

            socket.on('display', (message) => {
                changeDis(message);
            });

        }, []);


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
                if(GameMove === 0) {
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
            startText(false);
            disable();
        }

        return (
            <div className='Container'>
                <p className="idMarker">game id: {gameid}</p>
                <button className="exitMarker" onClick={() => {
                    SwitchComp(1);
                    socket.emit('leave game');
                }}>
                    x
                </button>
                <section className="game">
                    {engageGame && <div className="buttonholder"><h2>{gameDisplay}</h2></div>}
                    {!engageGame && <div className="buttonholder">
                        <button type="button" onClick={() => {
                            socket.emit('start game', gameid);
                        }}        
                        >start game</button>
                    </div>}
                    <section className="ActionButtons">
                        <button style={shieldStyle} 
                            onClick={() => {
                                socket.emit('make move', 1);
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
                                socket.emit('make move', 2);
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
                                socket.emit('make move', 3);
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
}