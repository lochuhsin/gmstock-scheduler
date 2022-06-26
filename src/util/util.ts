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
}
