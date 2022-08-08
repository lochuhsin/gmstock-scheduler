const settings = {
  twelveData: { plan: 'Grow', global: ['Level A'] },
  api: { apicount: 44 * 60 * 24, historyInterval: 4500 },
  token: {
    finMind:
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkYXRlIjoiMjAyMi0wNi0yMyAyMDoxNzowMyIsInVzZXJfaWQiOiJsb2NodWhzaW4iLCJpcCI6IjExNC4xMzYuNTguMTE1In0.tWMyITWi1PXdSGZGFuE_RcrUKtLYcsrP3DHgnlhZ6oc',
    twelveData: 'b0a59586047a49ac8b9cff87709499d7',
    server: {
      port: 3000,
    },
  },
  postgres: {
    user: 'root',
    password: 'root',
    database: 'postgres',
    host: 'postgres',
    port: 5432,
  },
  mongodb: {
    mongoConn: 'mongodb://root:root@mongo:27017/TimeSeries?authSource=admin',
  },
};

export default settings;
