import axios from 'axios';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace twelvedata {
  export async function testFunc() {
    const url = 'https://api.twelvedata.com/market_state';
    return await axios.get(url, {
      params: {
        apikey: 'b0a59586047a49ac8b9cff87709499d7',
      },
    });
  }

  export async function allStock() {
    const url = 'https://api.twelvedata.com/stocks';
    return await axios.get(url);
  }

  export async function allForexPair() {
    const url = 'https://api.twelvedata.com/forex_pairs';
    return await axios.get(url);
  }

  export async function allCryptoCurrency() {
    const url = 'https://api.twelvedata.com/cryptocurrencies';
    return await axios.get(url);
  }

  export async function allETF() {
    const url = 'https://api.twelvedata.com/etf';
    return await axios.get(url);
  }

  export async function allIndices() {
    const url = 'https://api.twelvedata.com/indices';
    return await axios.get(url);
  }
}
