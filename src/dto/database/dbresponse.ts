export interface db_rsp_stocktask {
  id: number;
  symbol: string;
  mic_code: string;
  latest_date: Date;
  oldest_date: Date;
  ishistorydatafinished: string;
  table_name: string;
  unique: string;
}

export interface db_rsp_forexpairtask {
  id: number;
  symbol: string;
  currency_base: string;
  latest_date: Date;
  oldest_date: Date;
  ishistorydatafinished: string;
  table_name: string;
  unique: string;
}

export interface db_rsp_cryptocurrencytask {
  id: number;
  symbol: string;
  currency_base: string;
  latest_date: Date;
  oldest_date: Date;
  ishistorydatafinished: string;
  table_name: string;
  unique: string;
}

export interface db_rsp_etftask {
  id: number;
  symbol: string;
  mic_code: string;
  latest_date: Date;
  oldest_date: Date;
  ishistorydatafinished: string;
  table_name: string;
  unique: string;
}

export interface db_rsp_indicetask {
  id: number;
  symbol: string;
  country: string;
  latest_date: Date;
  oldest_date: Date;
  ishistorydatafinished: string;
  table_name: string;
  unique: string;
}

export interface db_rsp_timeserise {
  datetime: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}
