import { IRow } from './types';

import { Row } from './row';

export class Game {
  private rows: Row[];

  constructor(rowsData: IRow[]) {
    const rows: Row[] = [];

    const rowsElm = document.getElementById('rows') as HTMLDivElement;

    rowsElm.innerHTML = '';

    for (let index = 0; index < rowsData.length; index += 1) {
      const { length } = rowsData[index];
      const row = new Row(index, length, rowsElm, this);
      rows.push(row);
    }

    this.rows = rows;
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
}
