import socketIoClient from 'socket.io-client';

import { IDetails, IMove, IRow } from './types';

window.onload = () => {
  const socket = socketIoClient('http://localhost:5000');

  socket.on('joinedRoom', () => {
  });

  const createRow = (row: IRow) => {
    const rowsElm = document.getElementById('rows');
    if (rowsElm !== null) {
      const rowElm = document.createElement('div');
      for (let i = 0; i < row.length; i += 1) {
        const packet = document.createElement('div');
        packet.classList.add('sugar-packet');
        rowElm.appendChild(packet);
      }
      rowsElm.appendChild(rowElm);
    } else {
      throw new Error('Rows element not found!');
    }
  };

  const startGame = (rows: IRow[]) => {
    for (const row of rows) {
      createRow(row);
    }
  };

  socket.on('startGame', (rows: IRow[]) => {
    startGame(rows);
  });

  socket.on('turn', (move: IMove | undefined) => {
    if (move) {

    }
  });
};
