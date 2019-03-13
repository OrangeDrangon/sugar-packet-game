import cors from 'cors';
import express from 'express';
import http from 'http';
import socketIo from 'socket.io';

import 'source-map-support/register';

import { IDetails, IMove, IRow } from './types';

const PORT = 5000;

const app = express();
const server = new http.Server(app);
const io = socketIo(server);

app.use(cors);

io.on('connection', (socket) => {

  socket.on('roomJoin', async (room: string) => {
    socket.leaveAll();
    const roomDictionary = io.sockets.adapter.rooms[room] || [];
    const socketCount = roomDictionary.length;

    if (socketCount >= 2) { return; }

    await socket.join(room);

    const details: IDetails = {
      room,
      count: socketCount + 1,
    };

    io.to(room).emit('joinedRoom', details);
    if (socketCount + 1 === 2) {
      const rows: IRow[] = [
        {
          length: 3,
          room: details.room,
        },
        {
          length: 5,
          room: details.room,
        },
      ];
      io.to(room).emit('startGame', rows);
      socket.emit('turn');
    }
  });

  socket.on('turn', (move: IMove) => {
    socket.broadcast.to(move.room).emit('turn', move);
  });
});

server.listen(PORT, () => console.log(`Listening to port ${PORT}!`));
