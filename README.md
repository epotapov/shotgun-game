# shotgun-game
Simple rock-paper-scissors like game made in javascript using Socket.io.

[The game it is based on.](https://www.wikihow.com/Play-the-Shotgun-Game)

## Play game locally
Just go to the backend folder and run the command:

    npm run start

## Rules
These are the same rules as in the web app:
- Every five seconds players pick:
  - Shield
  - Reload
  - Hit (Reload to Pick)
- Shield protects against hits
- Wins are obtained through unguarded hits (Hit a reloading player)
- Ties are obtained when both players hit each other