import io from 'socket.io-client';
import { Packet } from './Packet';

const socket = io('http://localhost:5000');
