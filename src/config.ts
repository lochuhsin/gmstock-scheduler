interface config {
  [key: string]: any;
}

const settings: config = {};

settings.twelveData = { plan: 'Basic', global: ['Level A'] };

settings.api = { apicount: 44 * 60 * 24, historyinterval: 4500 };

settings.startScript = { path: './startScript.sh' };

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
  host: 'db',
  port: 5432,
};

export default settings;
