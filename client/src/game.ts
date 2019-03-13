import { IRow, IMove } from './types';

import { Row } from './row';

export class Game {
  private rows: Row[];
  private socket: SocketIOClient.Socket;

  constructor(rowsData: IRow[], room: string, socket: SocketIOClient.Socket) {
    const rows: Row[] = [];

    const rowsElm = document.getElementById('rows') as HTMLDivElement;

    rowsElm.innerHTML = '';

    for (let index = 0; index < rowsData.length; index += 1) {
      const { length } = rowsData[index];
      const row = new Row(index, length, rowsElm, this);
      row.disable();
      rows.push(row);
    }

    this.rows = rows;
    this.socket = socket;

    const sendMove = document.createElement('button');
    sendMove.innerText = 'Send Move!';
    sendMove.onclick = () => {
      for (let index = 0; index < this.rows.length; index += 1) {
        const row = this.rows[index];
        console.log(row);

        if (row.selected.length > 0) {
          const move: IMove = {
            room,
            rowIndex: index,
            packetsRemoved: row.selected,
          };

          console.log(move);

          this.broadcastMove(move);
          return;
        }
      }
      alert('Select packets!');
    };
    rowsElm.appendChild(sendMove);
  }

  public diableRows(rowIgnored?: number) {
    for (let index = 0; index < this.rows.length; index += 1) {
      if (index === rowIgnored) {
        continue;
      }
      this.rows[index].disable();
    }
  }

  public enableRows() {
    for (const row of this.rows) {
      row.enable();
    }
  }

  public applyMove(move: IMove) {
    this.rows[move.rowIndex].deletePackets(move.packetsRemoved);
  }

  public broadcastMove(move: IMove) {
    this.applyMove(move);
    this.diableRows();
    this.socket.emit('turn', move);
  }
}
