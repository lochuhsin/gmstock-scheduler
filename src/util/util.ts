// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace util {
  export async function sleep(ms): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  export function convertDateToDateString(date: Date): string {
    const mon = date.getMonth() + 1;
    return (
      date.getFullYear() +
      '-' +
      ('0' + mon).slice(-2) +
      '-' +
      ('0' + date.getDate()).slice(-2)
    );
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
