interface config {
  [key: string]: any;
}

const settings: config = {};

settings.server = {
  port: 3000,
};

settings.postgres = {
  user: 'root',
  password: 'root',
  database: 'postgres',
  host: 'localhost',
  port: 5432,
};

export default settings;
