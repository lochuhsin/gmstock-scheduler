interface config {
  [key: string]: any;
}

const settings: config = {};

settings.twelveData = { plan: 'Grow', global: ['Level A'] };

settings.api = { apicount: 44 * 60 * 24, historyInterval: 4500 };

settings.token = {
  finMind:
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkYXRlIjoiMjAyMi0wNi0yMyAyMDoxNzowMyIsInVzZXJfaWQiOiJsb2NodWhzaW4iLCJpcCI6IjExNC4xMzYuNTguMTE1In0.tWMyITWi1PXdSGZGFuE_RcrUKtLYcsrP3DHgnlhZ6oc',
  twelveData: 'b0a59586047a49ac8b9cff87709499d7',
};

settings.server = {
  port: 3000,
};

settings.postgres = {
  user: 'root',
  password: 'root',
  database: 'postgres',
  host: 'postgres',
  port: 5432,
};

settings.mongodb = {
  mongoConn: 'mongodb://root:root@mongo:27017/TimeSeries?authSource=admin',
};

export default settings;
