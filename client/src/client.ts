import socketIoClient from 'socket.io-client';

import { IDetails, IMove, IRow } from './types';
import { Game } from './game';

window.onload = () => {
  const socket = socketIoClient('http://localhost:5000');
  let game: Game;

  const input = document.getElementById('room') as HTMLInputElement;
  const join = document.getElementById('join') as HTMLButtonElement;
  if (input !== null && join !== null) {
    join.onclick = (): void => {
      const room = input.value;
      if (room.length < 3) {
        alert('Must have a room name greater than or equal to 3 chars');
        return;
      }
      socket.emit('roomJoin', room);
    };

    socket.on('joinedRoom', (details: IDetails) => {
      console.log(details);
    });

    socket.on('startGame', (rows: IRow[]) => {
      game = new Game(rows);
    });

    socket.on('turn', (move: IMove | undefined) => {
      if (move) {

      }
    });
  }
};
