import React from 'react'
import { useState } from 'react'

export default function App() {
    return <Gamepad/>;
    /*if (!isGamepad) {
        return <HomePage/>;
    } else {
        return <Gamepad/>;
    }*/
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
                <button type="button" onClick={(e) => {
                    //setGamepad(true);
                }}>join game</button>
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


function Gamepad() { 
    const gameid = 67900;
    const ButtonStyle = {backgroundColor: "#464545", borderColor:"#353434"};
    const ButtonStyleEnd = {backgroundColor: "#464545", borderColor:"#353434", pointerEvents:"none"};
    const NewButtonStyle = {backgroundColor: "#353434", borderColor:"white", pointerEvents:"none"};
    const [engageGame, startGame] = useState(false);
    const [sheildStyle, changeB1] = useState(ButtonStyle);
    const [hitStyle, changeB2] = useState(ButtonStyle);
    const [reloadStyle, changeB3] = useState(ButtonStyle);
    const [secs, changeSec] = useState(5);

    const Gameplay = () => {
        setInterval(() => {
            changeSec(secs - 1);
        }, 1000);
    }

    //const [isGamepad, setGamepad] = useState(false);
    //if(isGamepad) 
    //    return <HomePage/>;
    return (
        <div className='Container'>
            <p className="idMarker">game id: {gameid}</p>
            <button className="exitMarker" onClick={() =>{
                //setGamepad(true);
            }}><p>x</p></button>
            <section className="game">
                {engageGame && <div className="buttonholder"><h2>{secs}</h2></div>}
                {!engageGame && <div className="buttonholder">
                    <button type="button" onClick={() => {
                        startGame(true);
                        Gameplay();
                    }}        
                    >start game</button>
                </div>}
                <section className="ActionButtons">
                    <button style={sheildStyle} 
                        onClick={() => {
                            changeB1(NewButtonStyle);
                            changeB2(ButtonStyleEnd);
                            changeB3(ButtonStyleEnd);
                        }}
                        onMouseEnter={() => {
                            if(sheildStyle.backgroundColor !== "#353434")
                                changeB1({...sheildStyle, borderColor: "white"});
                        }}
                        onMouseLeave={() =>{
                            if(sheildStyle.backgroundColor !== "#353434")
                                changeB1({...sheildStyle, borderColor: "#353434"});
                        }}
                    >shield</button>
                    <button style={hitStyle} 
                        onClick={() => {
                            changeB1(ButtonStyleEnd);
                            changeB2(NewButtonStyle);
                            changeB3(ButtonStyleEnd);
                        }}
                        onMouseEnter={() => {
                            if(hitStyle.backgroundColor !== "#353434") 
                                changeB2({...hitStyle, borderColor: "white"});
                        }}
                        onMouseLeave={() =>{
                            if(hitStyle.backgroundColor !== "#353434") 
                                changeB2({...hitStyle, borderColor: "#353434"});
                        }}
                    >hit</button>
                    <button style={reloadStyle} 
                        onClick={() => {
                            changeB1(ButtonStyleEnd);
                            changeB2(ButtonStyleEnd);
                            changeB3(NewButtonStyle);
                        }}
                        onMouseEnter={() => {
                            if(reloadStyle.backgroundColor !== "#353434")
                                changeB3({...reloadStyle, borderColor: "white"});

                        }}
                        onMouseLeave={() =>{
                            if(reloadStyle.backgroundColor !== "#353434")
                                changeB3({...reloadStyle, borderColor: "#353434"});
                        }}
                    >reload</button>
                </section>
            </section>
        </div>
    );
}