import axios from 'axios';
import settings from '../config';
import { twelve_base, twelve_timeseries_base } from 'src/dto/third_party/twelve_data/base';
import {
  rsp_stocks,
  rsp_forexpair,
  rsp_cryptocurrency,
  rsp_etf,
  rsp_indices,
  rsp_timeseries_meta,
  rsp_timeseries_values,
} from 'src/dto/third_party/twelve_data/stocks';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace twelveData {
  export async function testFunc() {
    const url = 'https://api.twelvedata.com/market_state';
    return await axios.get(url, {
      params: {
        apikey: settings.token['twelveData'],
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

  //https://twelvedata.com/docs#time-series
  // symbol: database symbol column
  // startDate, endDate format: '2000-01-01' or '2000-01-01 12:60:60'
  export async function timeSeries(
    symbol: string,
    startDate: string,
    endDate: string,
  ): Promise<[rsp_timeseries_meta, rsp_timeseries_values[]]> {
    const url = 'https://api.twelvedata.com/time_series';
    const params = {
      apikey: settings.token['twelveData'],
      symbol: symbol,
      interval: '1day',
      start_date: startDate,
      end_date: endDate,
      timezone: 'utc',
    };

    const rsp = await axios.get<
      twelve_timeseries_base<rsp_timeseries_meta, rsp_timeseries_values[]>>(url, {
      params: params,
    });
    return [rsp.data.meta, rsp.data.values];
  }
}
