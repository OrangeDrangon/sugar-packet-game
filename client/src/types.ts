export interface IDetails {
  count: number;
  room: string;
}

export interface IMove {
  rowIndex: number;
  packetsRemoved: number[];
  room: string;
}

export interface IRow {
  length: number;
  room: string;
}
