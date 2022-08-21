export class plan_base {
  global: string;
  plan: string;
}

export class rsp_stocks {
  symbol: string;
  name: string;
  currency: string;
  exchange: string;
  mic_code: string;
  country: string;
  type: string;
  access: plan_base;
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
  access: plan_base;
}

export class rsp_indices {
  symbol: string;
  name: string;
  country: string;
  currency: string;
  access: plan_base;
}

export interface timeseries {
  datetime: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
}

export interface rsp_timeseries {
  meta: object;
  message: string | null;
  values: timeseries[];
  status: string;
}
