// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace util {
  export async function sleep(ms): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
  export function getCurrentTime(): string {
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
        return this.container[this.container.length - 1];
      }
      return null;
    }

    push_back(obj: T): void {
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
