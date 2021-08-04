import React from 'react'
import { useState , useEffect } from 'react'
import { useForm } from "react-hook-form";
import { io } from "socket.io-client";


var reloaded = false;
var fired = false;

const socket = io();

export default function App() {
    const [component, SwitchComp] = useState(1);
    if(component === 1)
        return <HomePage/>;
    else if(component === 2)
        return <Gamepad/>;

    
    function HomePage() {
        const {register, handleSubmit} = useForm();
        const [errorBool, setError] = useState(false);

        useEffect(() => {
            socket.on('display error', () => setError(true));
            socket.on('joinRoomSuccess', () => SwitchComp(2));
        }, []);

        const onSubmit = data => {
            socket.emit('join game', data['game id']);
        }

        return ( //fix ui for mobile
            <div className='HomeContainer'>
                <section className="intro">
                    <h1>&gt;reload/hit/repeat</h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <section id="InputHolder">
                            <input 
                                type="text" 
                                placeholder="game id" 
                                {...register('game id', { required: true })}
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


    function Gamepad() { 
        const ButtonStyle = {backgroundColor: "#464545", borderColor:"#353434"};
        const ButtonStyleEnd = {backgroundColor: "#464545", borderColor:"#353434", pointerEvents:"none"};
        const NewButtonStyle = {backgroundColor: "#353434", borderColor:"white", pointerEvents:"none"};
        const waiting = "waiting for opponent";
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
                reloaded = false;
                fired = false;
            });

            socket.on('enable', () => reEnable());

            socket.on('disable', () => disable());

            socket.on('display', (message) => {
                changeDis(message);
            });
        }, []);

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