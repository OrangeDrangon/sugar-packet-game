import io from 'socket.io-client';

import { IDetails, IMove } from './types';

window.onload = () => {
  const socket = io('http://10.241.16.185:5000');

  const input = document.getElementById('input') as HTMLInputElement || document.createElement('input');
  input.id = 'room';
  input.type = 'text';
  document.body.appendChild(input);

  let room = '';

  const joinRoom = document.getElementById('joinRoom') || document.createElement('button');
  joinRoom.id = 'joinRoom';
  joinRoom.innerText = 'Join Room!';
  joinRoom.onclick = () => {
    if (input.textContent !== null && input.textContent.length <= 1) {
      room = input.textContent;
      socket.emit('roomJoin', room);
    }
  };
  document.body.appendChild(joinRoom);

  let myTurn = false;

  socket.on('joinedRoom', (details: IDetails) => {
    const div = document.getElementById('playerCount') || document.createElement('div');
    div.textContent = `${details.count} / 2 - Players Joined`;
    div.id = 'playerCount';
    document.body.appendChild(div);
  });

  socket.on('startGame', () => {
    const rows: HTMLElement[] = new Array(3).fill(0).map(() => {
      const element = document.createElement('div');
      return element;
    });
    for (let i = 0; i < 15; i++) {
      const iString = i < 10 ? '0' + i.toString() : i.toString();
      const button = document.getElementById(iString) || document.createElement('button');
      button.id = iString;
      if (i < 3) {
        button.classList.add('row1');
      } else if (i < 8) {
        button.classList.add('row2');
      } else {
        button.classList.add('row3');
      }
      button.classList.add('disabled');
      button.classList.add('sugar-packet')
      button.classList.remove('removed');
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
      if (i < 3) {
        rows[0].appendChild(button);
      } else if (i < 8) {
        rows[1].appendChild(button)
      } else {
        rows[2].appendChild(button);
      }
    }

    rows.forEach((row) => {
      document.body.appendChild(row);
    });

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
      removeSelected(document.getElementsByClassName('row1'));
      removeSelected(document.getElementsByClassName('row2'));
      removeSelected(document.getElementsByClassName('row3'));

      disableRow(document.getElementsByClassName('row1'));
      disableRow(document.getElementsByClassName('row2'));
      disableRow(document.getElementsByClassName('row3'));

      if (document.getElementsByClassName('removed').length === 15) {
        alert('you lose');
      }
    };
    document.body.appendChild(submit);
  });

  socket.on('turn', (move: undefined | IMove) => {
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
    if (document.getElementsByClassName('removed').length === 15) {
      alert('you win');
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

  function removeSelected(collection: HTMLCollection) {
    for (const element of [].slice.call(collection) as HTMLElement[]) {
      element.classList.remove('selected');
    }
  }

  function getIds(collection: HTMLCollection) {
    const selected: string[] = new Array();
    for (const element of [].slice.call(collection) as HTMLElement[]) {
      selected.push(element.id);
    }
    return selected;
  }

};
