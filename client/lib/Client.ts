import io from 'socket.io-client';
import { Packet } from './Packet';
import { Details } from './Types';

const socket = io('http://localhost:5000');

const room = 'abc';

socket.emit('roomJoin', room);

socket.on('joinedRoom', (details: Details) => {
    console.log(details);
});
