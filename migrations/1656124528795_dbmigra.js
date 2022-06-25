exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('stocklist', {
    symbol: { type: 'varchar(100)' },
    name: { type: 'varchar(200)' },
    currency: { type: 'varchar(50)' },
    exchange: { type: 'varchar(200)' },
    mic_code: { type: 'varchar(200)' },
    country: { type: 'varchar(50)' },
  });
};
