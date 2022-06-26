export class rsp_stocks {
  symbol: string;
  name: string;
  currency: string;
  exchange: string;
  mic_code: string;
  country: string;
  type: string;
}

export class rsp_forexpair {
  symbol: string;
  currency_group: string;
  currency_base: string;
  currency_quote: string;
}

export class rsp_cryptocurrency {
  symbol: string;
  available_exchanges: string[];
  currency_base: string;
  currency_quote: string;
}

export class rsp_etf {
  symbol: string;
  name: string;
  currency: string;
  exchange: string;
  mic_code: string;
  country: string;
}

export class rsp_indices {
  symbol: string;
  name: string;
  country: string;
  currency: string;
}

export class rsp_timeseries_meta {
  symbol: string;
  interval: string;
  currency: string;
  exchange_timezone: string;
  exchange: string;
  type: string;
}

export class rsp_timeseries_values {
  datetime: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
}
