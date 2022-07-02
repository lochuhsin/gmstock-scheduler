// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace util {
  export async function sleep(ms): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  export function modifyDateTimeWithDay(
    time: string,
    day_count: number,
  ): string {
    // 2022-06-11 12:13:45
    const [date_component, time_component] = time.split(' ');
    const date = new Date(date_component);
    date.setDate(date.getDate() + day_count);

    const mon = date.getMonth() + 1;
    return (
      date.getFullYear() +
      '-' +
      ('0' + mon).slice(-2) +
      '-' +
      ('0' + date.getDate()).slice(-2) +
      ' ' +
      time_component
    );
  }

  export function modifyDateWithDay(date: string, day_count: number): string {
    const d = new Date(date);
    d.setDate(d.getDate() + day_count);
    const mon = d.getMonth() + 1;
    return (
      d.getFullYear() +
      '-' +
      ('0' + mon).slice(-2) +
      '-' +
      ('0' + d.getDate()).slice(-2)
    );
  }

  export function getCurrentDate(): string {
    const date_ob = new Date();

    const date = ('0' + date_ob.getDate()).slice(-2);

    const month = ('0' + (date_ob.getMonth() + 1)).slice(-2);

    const year = date_ob.getFullYear();

    return `${year}-${month}-${date}`;
  }

  export function getCurrentDateTime(): string {
    const date_ob = new Date();

    const date = ('0' + date_ob.getDate()).slice(-2);

    const month = ('0' + (date_ob.getMonth() + 1)).slice(-2);

    const year = date_ob.getFullYear();

    const hours = date_ob.getHours();

    const minutes = date_ob.getMinutes();

    const seconds = date_ob.getSeconds();

    return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
  }

  export class queue<T> {
    private container: T[];
    constructor(iterable: Iterable<T> = []) {
      this.container = [];
      for (const obj of iterable) {
        this.container.push(obj);
      }
    }

    pop(): T | null {
      if (this.container.length > 0) {
        return this.container.shift();
      }
      return null;
    }

    peek(): T | null {
      if (this.container.length > 0) {
        return this.container[0];
      }
      return null;
    }

    push(obj: T): void {
      this.container.push(obj);
    }

    clear(): void {
      this.container = [];
    }

    getRestElements(): T[] | null {
      const elements = [];
      for (const obj of this.container) {
        elements.push(obj);
      }
      return elements;
    }

    getSize(): number {
      return this.container.length;
    }
  }
}
