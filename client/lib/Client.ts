import io from 'socket.io-client';
import { Packet } from './Packet';
import { Details, Move } from './Types';

const socket = io('http://10.241.16.185:5000');

const room = 'abc';

let myTurn = false;

socket.emit('roomJoin', room);

socket.on('joinedRoom', (details: Details) => {
    const div = document.getElementById('playerCount') || document.createElement('div');
    div.textContent = `${details.count} / 2 - Players Joined`;
    div.id = 'playerCount';
    document.body.appendChild(div);
});

socket.on('startGame', () => {
    for (let i = 0; i < 15; i++) {
        const iString = i < 10 ? '0' + i.toString() : i.toString();
        const button = document.getElementById(iString) || document.createElement('button');
        button.id = iString;
        button.innerText = 'Click to remove - ' + iString;
        if (i < 3) {
            button.classList.add('row1');
        } else if (i < 8) {
            button.classList.add('row2');
        } else {
            button.classList.add('row3');
        }
        button.classList.add('disabled');
        button.onclick = () => {
            if (button.classList.contains('selected')) {
                button.classList.remove('selected');
                if (document.getElementsByClassName('selected').length === 0) {
                    removeDisabled(document.getElementsByClassName('row1'));
                    removeDisabled(document.getElementsByClassName('row2'));
                    removeDisabled(document.getElementsByClassName('row3'));
                }
            } else {
                if (button.classList.contains('row1')) {
                    disableRow(document.getElementsByClassName('row2'));
                    disableRow(document.getElementsByClassName('row3'));
                } else if (button.classList.contains('row2')) {
                    disableRow(document.getElementsByClassName('row1'));
                    disableRow(document.getElementsByClassName('row3'));
                } else if (button.classList.contains('row3')) {
                    disableRow(document.getElementsByClassName('row1'));
                    disableRow(document.getElementsByClassName('row2'));
                }
                button.classList.add('selected');
            }
        };
        if (i === 3 || i === 8 || i === 15) {
            document.body.appendChild(document.createElement('br'));
        }
        document.body.appendChild(button);
    }

    const submit = document.getElementById('submit') || document.createElement('button');
    submit.id = 'submit';
    submit.innerText = 'Submit';
    submit.onclick = () => {
        if (!myTurn) { return; }

        const removed = getIds(document.getElementsByClassName('selected'));

        if (removed.length === 0) { return; }

        socket.emit('turn', { removed, room });

        myTurn = false;

        removed.forEach((id) => {
            const element = document.getElementById(id);
            if (element !== null) {
                element.classList.add('removed');
            }
        });

        disableRow(document.getElementsByClassName('row1'));
        disableRow(document.getElementsByClassName('row2'));
        disableRow(document.getElementsByClassName('row3'));
    };
    document.body.appendChild(submit);
});

socket.on('turn', (move: undefined | Move) => {
    myTurn = true;
    removeDisabled(document.getElementsByClassName('row1'));
    removeDisabled(document.getElementsByClassName('row2'));
    removeDisabled(document.getElementsByClassName('row3'));
    if (move) {
        move.removed.forEach((id) => {
            const element = document.getElementById(id);
            if (element !== null) {
                element.classList.add('removed');
            }
        });
    }
});

function disableRow(collection: HTMLCollection) {
    for (const element of [].slice.call(collection) as HTMLElement[]) {
        element.classList.add('disabled');
    }
}

function removeDisabled(collection: HTMLCollection) {
    for (const element of [].slice.call(collection) as HTMLElement[]) {
        element.classList.remove('disabled');
    }
}

// function removeSelected(collection: HTMLCollection) {
//     for (const element of [].slice.call(collection) as HTMLElement[]) {
//         element.classList.remove('selected');
//     }
// }

function getIds(collection: HTMLCollection) {
    const selected: string[] = new Array();
    for (const element of [].slice.call(collection) as HTMLElement[]) {
        selected.push(element.id);
    }
    return selected;
}
