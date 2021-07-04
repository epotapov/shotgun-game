import React from 'react'
import ReactDom from 'react-dom'
import './index.css'

function App(props) {
  const isGamepad = props.isGamepad;
  if (!isGamepad) {
    return <HomePage/>;
  } else {
    return <Gamepad/>;
  }
}

function HomePage() {
  return (
    <div className='Container'>
      <section className="intro">
        <h1>/shotgun-game</h1>
        <div className="buttonholder">
          <button type="button" onClick={(e) => {
            alert(e.target);
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
}


function Gamepad() {
  const gameid = 67900;
  return (
    <div className='Container'>
      <p className="idMarker">game id: {gameid}</p>
      <button className="exitMarker"><p>x</p></button>
      <section className="game">
        <div className="buttonholder">
            <button type="button" onClick={(e) => {
              alert(e.target);
            }}>start game</button>
        </div>
        <section className="ActionButtons">
              <button>shield</button>
              <button>hit</button>
              <button>reload</button>
            </section>
      </section>
    </div>
  );
}

ReactDom.render(
  <App isGamepad={true} />, 
  document.getElementById('root')
);