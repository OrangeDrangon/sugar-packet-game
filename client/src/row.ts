import { Game } from './game';

export class Row {
  public id: number;
  public selected: number[];

  private length: number;
  private parent: HTMLDivElement;
  private row: HTMLDivElement;
  private packets: HTMLDivElement[];

  public constructor(id: number, length: number,
                     parentElement: HTMLDivElement, game: Game) {
    this.id = id;
    this.length = length;
    this.parent = parentElement;

    this.row = document.createElement('div');
    this.row.classList.add('row');

    const packets: HTMLDivElement[] = [];

    for (let index = 0; index < this.length; index += 1) {
      const packet = document.createElement('div');
      packet.id = `${this.id}-${index}`;
      packet.classList.add('sugar-packet');

      packet.onclick = () => {
        if (this.packets[index].classList.contains('disabled')) {
          return;
        }

        if (this.packets[index].classList.contains('selected')) {
          this.unselect(index);

          if (this.selected.length === 0) {
            game.enableRows();
          }

          return;
        }

        this.select(index);
        game.diableRows(this.id);
      };

      packets.push(packet);
      this.row.appendChild(packet);
    }

    this.packets = packets;

    this.parent.appendChild(this.row);

    this.selected = [];
  }

  public disable() {
    for (let index = 0; index < this.packets.length; index += 1) {
      const packet = this.packets[index];
      packet.classList.add('disabled');
      this.unselect(index);
    }
  }

  public enable() {
    for (const packet of this.packets) {
      packet.classList.remove('disabled');
    }
  }

  private select(index: number) {
    this.packets[index].classList.add('selected');
    this.selected.push(index);
  }

  private unselect(index: number) {
    this.packets[index].classList.remove('selected');
    this.selected = this.selected.filter((num) => {
      if (num === index) {
        return false;
      }
      return true;
    });

  }

  public deletePackets(indexs: number[]) {
    for (const index of indexs) {
      this.packets[index].remove();
    }
  }
}
