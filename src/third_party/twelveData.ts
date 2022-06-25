import axios from 'axios';
import { twelve_base } from 'src/dto/third_party/twelve_data/base';
import {
  rsp_stocks,
  rsp_forexpair,
  rsp_cryptocurrency,
  rsp_etf,
  rsp_indices,
} from 'src/dto/third_party/twelve_data/stocks';

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

  export async function allStocks(): Promise<rsp_stocks[]> {
    const url = 'https://api.twelvedata.com/stocks';
    const params = {
      country: 'Taiwan',
    };
    const rsp = await axios.get<twelve_base<rsp_stocks[]>>(url, {
      params: params,
    });
    return rsp.data.data;
  }

  export async function allForexPair(): Promise<rsp_forexpair[]> {
    const url = 'https://api.twelvedata.com/forex_pairs';
    const rsp = await axios.get<twelve_base<rsp_forexpair[]>>(url);
    return rsp.data.data;
  }

  export async function allCryptoCurrency(): Promise<rsp_cryptocurrency[]> {
    const url = 'https://api.twelvedata.com/cryptocurrencies';
    const rsp = await axios.get<twelve_base<rsp_cryptocurrency[]>>(url);
    return rsp.data.data;
  }

  export async function allETF(): Promise<rsp_etf[]> {
    const url = 'https://api.twelvedata.com/etf';
    const rsp = await axios.get<twelve_base<rsp_etf[]>>(url);
    return rsp.data.data;
  }

  export async function allIndices(): Promise<rsp_indices[]> {
    const url = 'https://api.twelvedata.com/indices';
    const rsp = await axios.get<twelve_base<rsp_indices[]>>(url);
    return rsp.data.data;
  }
}
