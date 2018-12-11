import cors from 'cors';
import express from 'express';
import http from 'http';
import sockets from 'socket.io';
import 'source-map-support/register';

const PORT = 5000;

const app = express();
const server = new http.Server(app);
const io = sockets(server);

app.use(cors);

io.on('connection', (socket) => {
    socket.on('roomJoin', async (room: string) => {
        socket.leaveAll();
        const roomDictionary = io.sockets.adapter.rooms[room] || [];
        const socketCount = roomDictionary.length;

        if (socketCount >= 2) { return; }

        await socket.join(room);

        io.to(room).emit('joinedRoom', { count: socketCount + 1, room });

        if (socketCount + 1 === 2) {
            io.to(room).emit('startGame');
            socket.emit('turn');
        }
    });

    socket.on('turn', (move) => {
        socket.broadcast.to(move.room).emit('turn', move);
    });
});

server.listen(PORT, () => console.log(`Listening to port ${PORT}!`));
