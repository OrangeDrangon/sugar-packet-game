// Imports
import socketIoClient from 'socket.io-client';

import { IDetails, IMove, IRow } from './types';
import { Game } from './game';

window.onload = () => {
  // Starts socket
  const socket = socketIoClient('http://localhost:5000');
  let game: Game;

  // Links to the room name and join button
  const input = document.getElementById('room') as HTMLInputElement;
  const join = document.getElementById('join') as HTMLButtonElement;

  if (input !== null && join !== null) {
    join.onclick = (): void => {
      // Checks if the room name meets requirements
      const room = input.value;
      if (room.length < 3) {
        alert('Must have a room name greater than or equal to 3 chars');
        return;
      }
      // Sends the room join command to the server
      socket.emit('roomJoin', room);
    };

    // Recieved whenever someone joins the room
    socket.on('joinedRoom', (details: IDetails) => {
      console.log(details);
    });

    // Creates game instance when server says it is ready
    socket.on('startGame', (rows: IRow[]) => {
      game = new Game(rows, rows[0].room, socket);
    });

    // Sets your board up for playing and applies the move if it exists
    socket.on('turn', (move: IMove | undefined) => {
      if (move) {
        game.applyMove(move);
      }
      game.enableRows();
    });
  }
};
