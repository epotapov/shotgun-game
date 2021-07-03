import React from 'react'
import ReactDom from 'react-dom'
import './index.css'

function Main() {
  return (
    <HomePage/>
  );
}

function HomePage() {
  return (
    <div className='Container'>
      <section className="intro">
        <h1>/shotgun-game</h1>
        <div id="buttonholder">
          <button onClick = {hello}>start game</button>
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

function hello() {
  console.log("hello");
}

function Gamepad() {
  return (
    <div className='Container'>
      <h1>hello</h1>
    </div>
  );
}

ReactDom.render(<Main/>, document.getElementById('root'));