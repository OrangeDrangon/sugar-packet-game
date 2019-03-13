import { IRow, IMove } from './types';

import { Row } from './row';
/**
 *
 * The main class of the sugar packet game.
 * Requires the row data, room name, and the active socket connection.
 * It creates instances of row classes and adds them to the DOM along with the send move button.
 * Provides functions for minipulating the whole board.
 *
 */
export class Game {
  private rows: Row[];
  private socket: SocketIOClient.Socket;

  /**
   *
   * Creates an instance of Game. Adds the join button to the DOM.
   *
   * @param {IRow[]} rowsData
   * @param {string} room
   * @param {SocketIOClient.Socket} socket
   * @memberof Game
   *
   */
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

        if (row.selected.length > 0) {
          const move: IMove = {
            room,
            rowIndex: index,
            packetsRemoved: row.selected,
          };

          this.broadcastMove(move);
          return;
        }
      }
      alert('Select packets!');
    };
    rowsElm.appendChild(sendMove);
  }
  /**
   *
   * Loops through all of the rows and disables them.
   * Allows for disabling all but one row with the optional parameters.
   *
   * @param {number} [rowIgnored]
   * @memberof Game
   *
   */
  public diableRows(rowIgnored?: number) {
    for (let index = 0; index < this.rows.length; index += 1) {
      if (index === rowIgnored) {
        continue;
      }
      this.rows[index].disable();
    }
  }
  /**
   *
   * Enables all rows of the board
   *
   * @memberof Game
   *
   */
  public enableRows() {
    for (const row of this.rows) {
      row.enable();
    }
  }
  /**
   *
   * Applies the move provided to the board deleting the packets that have been chosen.
   *
   * @param {IMove} move
   * @memberof Game
   *
   */
  public applyMove(move: IMove) {
    this.rows[move.rowIndex].deletePackets(move.packetsRemoved);
  }
  /**
   *
   * Applies the move to the board, disables all rows, and emits the move to the server.
   *
   * @param {IMove} move
   * @memberof Game
   *
   */
  public broadcastMove(move: IMove) {
    this.applyMove(move);
    this.diableRows();
    this.socket.emit('turn', move);
  }
}
