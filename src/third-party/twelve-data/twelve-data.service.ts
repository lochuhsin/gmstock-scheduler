import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import settings from 'src/config';
import { twelve_base } from 'src/dto/third_party/twelve_data/base';
import {
  rsp_stocks,
  rsp_forexpair,
  rsp_cryptocurrency,
  rsp_etf,
  rsp_indices,
  rsp_timeseries,
  timeseries,
} from 'src/dto/third_party/twelve_data/data';

@Injectable()
// eslint-disable-next-line @typescript-eslint/no-namespace
export class TwelveDataService {
  constructor(private readonly httpService: HttpService) {}

  async allStocks(): Promise<rsp_stocks[]> {
    const url = 'https://api.twelvedata.com/stocks';
    const rsp = await this.httpService.axiosRef.get<twelve_base<rsp_stocks[]>>(
      url,
      {
        params: {
          show_plan: true,
        },
      },
    );
    return rsp.data.data;
  }

  async allForexPair(): Promise<rsp_forexpair[]> {
    const url = 'https://api.twelvedata.com/forex_pairs';
    const rsp = await this.httpService.axiosRef.get<
      twelve_base<rsp_forexpair[]>
    >(url);
    return rsp.data.data;
  }

  async allCryptoCurrency(): Promise<rsp_cryptocurrency[]> {
    const url = 'https://api.twelvedata.com/cryptocurrencies';
    const rsp = await this.httpService.axiosRef.get<
      twelve_base<rsp_cryptocurrency[]>
    >(url);
    return rsp.data.data;
  }

  async allETF(): Promise<rsp_etf[]> {
    const url = 'https://api.twelvedata.com/etf';
    const rsp = await this.httpService.axiosRef.get<twelve_base<rsp_etf[]>>(
      url,
      {
        params: {
          show_plan: true,
        },
      },
    );
    return rsp.data.data;
  }

  async allIndices(): Promise<rsp_indices[]> {
    const url = 'https://api.twelvedata.com/indices';
    const rsp = await this.httpService.axiosRef.get<twelve_base<rsp_indices[]>>(
      url,
      {
        params: {
          show_plan: true,
        },
      },
    );
    return rsp.data.data;
  }

  async testFunc(
    symbol: string,
    startDate: string,
    endDate: string,
  ): Promise<any> {
    const url = 'https://api.twelvedata.com/time_series';
    const params = {
      apikey: settings.token['twelveData'],
      symbol: symbol,
      interval: '1day',
      start_date: startDate,
      end_date: endDate,
      timezone: 'utc',
      format: 'json',
    };

    const rsp = await this.httpService.axiosRef.get(url, {
      params: params,
    });

    return rsp.data;
  }

  // https://twelvedata.com/docs#time-series
  // symbol: database symbol column
  // startDate, endDate format: '2000-01-01' or '2000-01-01 12:60:60'
  async timeSeries(
    symbol: string,
    startDate: string,
    endDate: string,
  ): Promise<timeseries[] | string> {
    const url = 'https://api.twelvedata.com/time_series';
    const params = {
      apikey: settings.token['twelveData'],
      symbol: symbol,
      interval: '1day',
      start_date: startDate,
      end_date: endDate,
      timezone: 'utc',
      format: 'json',
    };
    const rsp = await this.httpService.axiosRef.get(url, {
      params: params,
    });
    const data: rsp_timeseries = rsp.data;
    if (data.status != 'ok') {
      return data.message;
    }
    return data.values;
  }

  // only return specific columns, there are more data originally
  // https://twelvedata.com/docs#quote
  async latest(symbol: string): Promise<timeseries> {
    const url = 'https://api.twelvedata.com/quote';
    const params = {
      apikey: settings.token['twelveData'],
      symbol: symbol,
      interval: '1day',
    };
    const rsp = await this.httpService.axiosRef.get<any>(url, {
      params: params,
    });

    const text = rsp.data;
    if (text.hasOwnProperty('code')) {
      if (text.code == 400) {
        return null;
      } else {
        throw new Error(text.message);
      }
    }

    return {
      datetime: text.datetime,
      open: text.open,
      high: text.high,
      low: text.low,
      close: text.close,
      volume: text.volume,
    };
  }
}
