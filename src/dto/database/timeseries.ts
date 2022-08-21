export interface db_timeseries {
  id: number;
  symbol: string;
  latest_date: Date;
  oldest_date: Date;
  ishistorydatafinished: string;
  table_name: string;
}
