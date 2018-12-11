import cors from 'cors';
import express from 'express';
import http from 'http';
import sockets from 'socket.io';

const app = express();
const server = new http.Server(app);
const io = sockets(server);

app.use(cors);

io.on('connection', (socket) => {
    socket.on('roomJoin', (event) => {
        console.log(event);
    });
});

server.listen(5000, () => console.log('Listening on port 3000'));
