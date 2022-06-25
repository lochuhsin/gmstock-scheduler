import axios from 'axios';
import { twelve_base } from 'src/dto/third_party/twelve_data/base';
import { rsp_stocks } from 'src/dto/third_party/twelve_data/stocks';

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

  export async function allStockList(): Promise<rsp_stocks[]> {
    const url = 'https://api.twelvedata.com/stocks';
    const params = {
      country: 'Taiwan',
    };
    var rsp = await axios.get<twelve_base<rsp_stocks[]>>(url, {
      params: params,
    });
    return rsp.data.data;
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
