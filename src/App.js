import React from 'react'
import { useState } from 'react'

export default function App() {
    return <HomePage/>;
    /*if (!isGamepad) {
        return <HomePage/>;
    } else {
        return <Gamepad/>;
    }*/
}
  
function HomePage() {
    const [isGamepad, setGamepad] = useState(false);
    if(!isGamepad){
        return (
            <div className='Container'>
                <section className="intro">
                <h1>/shotgun-game</h1>
                <div className="buttonholder">
                    <button type="button" onClick={(e) => {
                        setGamepad(true);
                    }}>start game</button>
                </div>
                <p>
                    This is shotgun-game. This is based on the rock, paper,
                    scissors <a href="https://www.wikihow.com/Play-the-Shotgun-Game" target="_blank" rel="noreferrer">style game</a>. 
                    You will be able to play this with a friend or by yourself. 
                </p>
                </section>
            </div>
        );
    } else {
        return <Gamepad/>;
    }
}


function Gamepad() {
    const gameid = 67900;
    const num = 1;
    const ButtonStyle = {backgroundColor: "#464545", borderColor:"#353434"};
    const NewButtonStyle = {backgroundColor: "#353434", borderColor:"white"};
    const [number, changeNumber] = useState(num);
    const [sheildStyle, changeB1] = useState(ButtonStyle);
    const [hitStyle, changeB2] = useState(ButtonStyle);
    const [reloadStyle, changeB3] = useState(ButtonStyle);
    return (
        <div className='Container'>
            <p className="idMarker">game id: {gameid}</p>
            <button className="exitMarker"><p>x</p></button>
            <section className="game">
                <h2 style={{textAlign: "center"}}>{number}</h2>
                <div className="buttonholder">
                    <button type="button" onClick={() => {
                        
                    }}        
                    >start game</button>
                </div>
                <section className="ActionButtons">
                    <button style={sheildStyle} 
                        onClick={() => {
                            if (sheildStyle === ButtonStyle) {
                            }
                            changeB1(NewButtonStyle);
                            changeB2(ButtonStyle);
                            changeB3(ButtonStyle);
                            changeNumber(number - 1);
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
                            if (hitStyle === ButtonStyle) {
                            }
                            changeB1(ButtonStyle);
                            changeB2(NewButtonStyle);
                            changeB3(ButtonStyle);
                            changeNumber(number + 1);
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
                            if (reloadStyle === ButtonStyle) {
                            }
                            changeB1(ButtonStyle);
                            changeB2(ButtonStyle);
                            changeB3(NewButtonStyle);
                            changeNumber(0);
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