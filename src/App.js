import './App.css';

var signedin = false;

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {signedin ? <GameRoom/> : <Lobby/>}
      </header>
    </div>
  );
}

function Lobby() {
  return(
    <div>
      <p>This is Shotgun-Game</p>
      <input type="text" id="playerNameInput" name="playerNameInput"></input>
      <button id="playerNameenter" onClick={signedin = true}>Enter</button>
    </div>
  );
}

function GameRoom() {
  return(
    <div>
      <p>You have entered the game room.</p>
    </div>
  );
}

export default App;
