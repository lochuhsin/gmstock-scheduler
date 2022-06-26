export class twelve_base<T> {
  status: string;
  data: T;
}

export class twelve_timeseries_base<Meta, Val> {
  meta: Meta;
  values: Val;
  status: string;
}
